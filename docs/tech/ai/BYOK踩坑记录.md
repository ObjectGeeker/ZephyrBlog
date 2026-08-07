---
title: BYOK 构建踩坑记录
date: 2026-08-07
description: 记录在开发AI应用时搭建BYOK时遇到的问题和解决方案
tags: [GoogleADK, SpringAI, 大模型]
---
# BYOK 构建踩坑记录

## 环境基础

SpringBoot + GoogleADK 1.7.1 + Spring AI 2.0.0

## 坑：ADK 携带工具调用时 OpenAiChatModel 抛 ClassCastException

**背景**：BYOK（Bring Your Own Key）模式下，通过 `DynamicChatModel` 动态包装 `OpenAiChatModel`，交给 Google ADK 使用。
依赖版本：`google-adk-spring-ai 1.7.1` + `spring-ai-openai 2.0.0`。

**现象**：Agent 只要配置了工具（MCP / function-calls），首次调用大模型就抛异常；不配工具则正常。

```
java.lang.ClassCastException: class org.springframework.ai.model.tool.DefaultToolCallingChatOptions
  cannot be cast to class org.springframework.ai.openai.OpenAiChatOptions
  at org.springframework.ai.openai.OpenAiChatModel.createRequest(...)
```

**根因**：两个框架的契约缺口，三个环节叠加导致：

1. ADK 构造 Prompt 前先调 `chatModel.getOptions()` 作为 options 底座（`SpringAI.resolveDefaultOptions`），
   传给 `MessageConverter.buildChatOptions(llmRequest, modelDefaultOptions)`。该方法有三个分支：
   - 无工具且无 ADK 生成配置 → 返回 null，由 Spring AI 兜底注入模型默认 options；
   - 首选路径：底座 `instanceof ToolCallingChatOptions` → `mutate()` 派生并保留厂商类型；
   - 回退路径：用通用 `ToolCallingChatOptions.builder()` 构造，产物是 `DefaultToolCallingChatOptions`；
     ADK 源码注释明确说明首选路径就是为规避 Spring AI OpenAI 2.0.0 对 Prompt.getOptions() 的强转而设计；
2. `ChatModel.getOptions()` 的接口默认实现返回通用的 `DefaultChatOptions`（非 ToolCallingChatOptions），
   而 `DynamicChatModel` 作为包装类当时未覆写该方法，导致 ADK 拿不到底层的 `OpenAiChatOptions`，
   命中上述回退路径（携带工具时必触发）；
3. `OpenAiChatModel.createRequest` 对 options 直接强转 `(OpenAiChatOptions) prompt.getOptions()`，无任何类型判断。

直接把 `OpenAiChatModel` 交给 ADK 不会遇到此问题，因为它的 `getOptions()` 返回自身的 `OpenAiChatOptions`，
`buildChatOptions` 走首选路径 mutate 派生，产物仍是厂商类型；问题只出在 `DynamicChatModel` 这层包装把底层 options 对 ADK 隐藏了。

**修复**（均在 `DynamicChatModel`）：

1. 覆写 `getOptions()` 透传底层 `OpenAiChatModel` 的 options——这是根治，让 `buildChatOptions` 走 ADK 设计的首选路径，
   基于 `OpenAiChatOptions` mutate 派生，自动保留 model/apiKey/baseUrl 等厂商配置；
2. 另保留防御性归一化方法 `normalizePrompt`（当前未接入 call/stream 主链路）：options 为 null 或已是
   `OpenAiChatOptions` 时原样透传，否则基于模型默认 options 调 `mutate()` 派生新对象再合并 `toolCallbacks`、
   `toolContext`；若未来有调用方绕过 ADK 直接传入通用类型 options，可在 call/stream 中重新接入。

**实现注意点**：

1. **包装类必须透传 getOptions()**：任何包装 `ChatModel` 的装饰器/代理，若不透传 `getOptions()`，
   ADK 就会因拿到接口默认的通用 options 而回退到通用类型，这是本坑的最隐蔽之处；
2. **工具回调不能丢**：转换时如果只搬 model/apiKey/baseUrl 而落下 `toolCallbacks`，请求会变成不带工具的调用，
   function call 静默失效且不报错，比 ClassCastException 更难排查；
3. **createRequest 只从 Prompt options 读 model**：转换后的 options 必须携带 model 字段，否则请求缺 model 报错；
   这也是推荐「以默认 options 为底 mutate()」而非「new 一份空 options 只填三要素」的原因——前者自动继承所有默认参数，
   后者将来给默认 options 加 temperature、maxTokens 等配置时容易漏搬；
4. `DefaultToolCallingChatOptions` 上不存在 model/apiKey/baseUrl 字段，无法就地修改，只能生成新对象。

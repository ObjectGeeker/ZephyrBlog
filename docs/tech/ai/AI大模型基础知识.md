---
title: AI大模型基础知识
date: 2026-08-06
description: AI应用开发的基础知识，包括大模型是什么、大模型的分类、大模型如何接入开发以及Prompt如何优化
tags: [大模型]
---
# AI大模型基础知识

## AI 大模型的简单概念

1. 超大规模参数
2. 海量训练数据
3. 强大的生成能力
4. 复杂任务推理

本质上AI大模型还是属于AI的范畴，也就是人工智能，只是大模型拥有更大的参数和训练数据，以及核心架构

所以AI也只是一个推测模型，AI不具有创造力

## AI大模型的分类

1. 文本模型（只能输入和输出文字）
2. 多模态模型（可以处理两种或以上的模态，如文本+图像、文本+音频）
3. 全模态模型（追求尽可能覆盖所有主流模态，如文本、图像、音频、视频、3D点云、传感器信号等）

## AI 大模型接入

> 接入AI大模型有两种方式，一种是直接调用AI模型本身，就是最原始的http请求
>
> 另一种就是通过框架接入，例如SpringAI Langchain4j 这种框架，我们配置好APIKEY和URL，就可以直接调用

**这里选择框架接入**

- 首先引入SpringAI框架

```xml
<dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-dashscope</artifactId>
    <version>1.1.2.3</version>
    <scope>compile</scope>
</dependency>
```

- 然后按照官网指导编写API ChatModel

```java
public void test() {
    DashScopeApi dashScopeApi = DashScopeApi.builder()
            .apiKey("")
            .build();
  
    DashScopeChatModel chatModel = DashScopeChatModel.builder()
            .dashScopeApi(dashScopeApi)
            .defaultOptions(DashScopeChatOptions.builder().model("deepseek-v4-flash").build()).build();
  
    String response = chatModel.call("你好");
}
```

## Prompt 优化技巧

### 提示词学习网站

[Prompt Engineering Guide](https://www.promptingguide.ai/zh)

[Spring AI 提示词工程](https://docs.spring.io/spring-ai/reference/api/prompt.html#_prompt_engineering)

[Authropic 提示词工程](https://platform.claude.com/docs/zh-CN/build-with-claude/prompt-engineering/overview)

### 提示词仓库

如果是特定职业或者是特定功能的提示词，可以直接找别人用的好的提示词
[Authropic 提示词库](https://platform.claude.com/docs/zh-CN/build-with-claude/prompt-engineering/claude-prompting-best-practices)

### 优化技巧

1. 明确角色和任务
   - 你是一名xxx，你的任务是xxx
2. 提供详细说明和具体示例
3. 结构化输入输出，引导性思维

### 进阶优化技巧

1. 思维链提示法
   - 一步步引导AI做事情，把第一步第二步都提示完整
2. 少样本提示法
   - 给AI样本，告诉AI应该是什么样子

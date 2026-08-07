import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ZephyrBlog",
  description: "怕什么真理无穷，进一步有一步的欢喜",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',

    nav: [
      { text: '首页', link: '/' },
      { text: '技术', link: '/tech' },
      { text: '项目', link: '/project' },
      { text: '成长', link: '/growth' },
    ],

    // 多侧边栏：按路径前缀匹配，访问 /tech/ 下的页面只显示技术侧边栏，以此类推
    sidebar: {
      '/tech/': [
        {
          text: 'AI技术',
          items: [
            { text: 'AI大模型基础知识', link: '/tech/ai/AI大模型基础知识' },
            { text: 'BYOK 构建踩坑记录', link: '/tech/ai/BYOK踩坑记录' },
          ],
        },
        {
          text: 'MySQL技术',
          items: [
            { text: '存储引擎', link: '/tech/mysql/存储引擎' },
          ],
        },
      ],
      '/project/': [
        {
          text: '项目记录',
          items: [
            { text: 'AI代码自动评审组件', link: '/project/openai-code-review/AI代码自动评审组件' },
          ],
        },
      ],
      '/growth/': [
        {
          text: '成长记录',
          items: [
            { text: '如何坚持长期学习', link: '/growth/long-term-learning' },
            { text: '一次技术分享的复盘', link: '/growth/sharing-retrospective' },
            { text: '读《认知觉醒》的几点收获', link: '/growth/reading-notes' },
            { text: '年中目标回顾与调整', link: '/growth/mid-year-review' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

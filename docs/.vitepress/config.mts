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

    sidebar: [
      // {
      //   text: '技术',
      //   items: [
      //     { text: '前端技术', link: '/tech/frontend' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

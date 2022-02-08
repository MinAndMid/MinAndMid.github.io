module.exports = {
  // 站点配置
  lang: 'zh-CN',
  base: '/Docs/',
  title: 'IBeenNote',
  head: [
    ['script', {
      src: '//cdn.jsdelivr.net/npm/@waline/client',
    }],
  ],

  plugins: [
    '@vuepress/plugin-search',
    '@snippetors/vuepress-plugin-tabs',
    'vuepress-plugin-clipboard',
    ['vuepress-plugin-waline', {
      serverURL: 'https://devsite-blue.vercel.app',
      login: 'disable',
    }],

  ],

  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    home: '/',

    navbar: [{
        text: 'Home',
        link: '/',
      },
      {
        text: 'Guide',
        link: '/guide/',
      },
    ],

    sidebar: [{
      text: '指南',
      children: ['highAvaClu.md', '/guide/markdownplus.md'],
    }, ],



    repo: 'https://github.com/MinAndMid',
    repoLabel: 'Github',

    tip: '提示',
    warning: '注意',
    danger: '警告',

    notFound: ['找不到页面了...', '刷新页面试试呀...'],

    backToHome: '返回主页',
    toggleDarkMode: '切换模式',
  },
};

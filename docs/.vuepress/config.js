module.exports = {
  // 站点配置
  base: '/Docs/',
  title: 'IBeenNote',

  plugins: [
    '@vuepress/plugin-search',
    '@snippetors/vuepress-plugin-code-copy',
  ],

  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    home: '/Docs/',

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
      children: ['/guide/README.md'],
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
}

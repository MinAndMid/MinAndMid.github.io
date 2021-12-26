module.exports = {
  // 站点配置
  base: '/',
  title: 'IBeenNote',

  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    home: '/',
    navbar: [
      {
        text: 'Home',
        link: '/',
      },
    ],

    repo: 'https://minandmid.github.io/',
    repoLabel: 'Github',

    sidebar: [
      {
        text: '指南',
        children: ['/guide/README.md'],
      },
    ],

    tip: '提示',
    warning: '注意',
    danger: '警告',

    notFound: ['找不到页面了...','刷新页面试试呀...'],

    backToHome: '返回主页',
    toggleDarkMode: '切换模式',
  },
}
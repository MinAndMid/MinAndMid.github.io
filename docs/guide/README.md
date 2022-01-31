---
title: 'Markdown扩展'
editLink: true
lastUpdated: true
---

## 目录
[[toc]]

## 提示

::: tip
这是一个提示
:::

## 注意

::: warning
这是一个注意
:::

## 警告

::: danger
这是一个警告
:::

::: danger STOP
自定义一个标题STOP
:::

## 查看详情
::: details 点击查看代码
```js
console.log('你好，VuePress！')
```
:::

## Badge

-   VuePress - <Badge type="tip" text="v2" vertical="top" />
-   VuePress - <Badge type="warning" text="v2" vertical="middle" />
-   VuePress - <Badge type="danger" text="v2" vertical="bottom" />

## CodeGroup

<CodeGroup>
  <CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM" active>

```bash:no-line-numbers
npm install
```

  </CodeGroupItem>
</CodeGroup>

## CodeGroup别名
:::: code-group
::: code-group-item FOO
```js
const foo = 'foo'
```
:::
::: code-group-item BAR
```js
const bar = 'bar'
```
:::
::::

## Github表格
| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

~~以及删除线~~

## 链接

看一下外部链接[百度](https://www.baidu.com)
看一下内部链接[首页](../README.md)

## 代码行高亮
```ts{1,6-8}
import type { UserConfig } from '@vuepress/cli'

export const config: UserConfig = {
  title: '你好， VuePress',

  themeConfig: {
    logo: 'https://vuejs.org/images/logo.png',
  },
}
```

## 行号
```ts
// 行号默认是启用的
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:no-line-numbers
// 行号被禁用
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

## 引用代码块
```md
<!-- 最简单的语法 -->
@[code](../foo.js)

<!-- 导入 1 至 10 行 -->
@[code{1-10}](../foo.js)

<!-- 指定语言 -->
@[code js](../foo.js)

<!-- 指定语言 且 2 和 4-5行 高亮 -->
@[code js{2,4-5}](../foo.js)

<!-- js代码，3-10行，第3行高亮，不加行号 -->
@[code{3-10} js{3}:no-line-numbers](../foo.js)
```

@[code{3-15} js{1,2,5}](../.vuepress/config.js)

## Vue组件 <Badge text="演示" />
这是默认主题内置的 `<Badge />` 组件 <Badge text="演示" />

## 插件
:::: tabs

::: tab A

一个平平常常的日子，细蒙蒙的雨丝夹着一星半点的雪花，正纷纷淋淋地向大地飘洒着。时令已快到惊蛰，雪当然再不会存留，往往还没等落地，就已经消失得无踪无影了。黄土高原严寒而漫长的冬天看来就要过去，但那真正温暖的春天还远远地没有到来。

:::

::: tab B

床前明月光，  
疑是地上霜。  
举头望明月，  
低头思故乡。

:::

::::

<!--  -->

:::: tabs tab-position:right

::: tab A

content 1

:::

::: tab B eager

eagerly loaded content
![小女孩](/img/100.jpg)

:::

::::

<!--  -->

:::: tabs type:card tab-position:bottom

::: tab A

content 1

:::

::: tab B

Note that this content won't be eagerly loaded since the word `eager` will be treated as a part of the tab name

:::

::::

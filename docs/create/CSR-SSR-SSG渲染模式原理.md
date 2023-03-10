## CSR、SSR、SSG 渲染模式原理

##### CSR 客户端渲染

它的核心特征是没有页面 html 的具体内容，是通过 js 来完成页面的渲染
eg:常见的 vue 、 react 搭建的单页应用
如：vite 官方脚手架的模版 html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

可以看到模版中除了一个 #root 元素和一个 script 标签之外，并没有其他的内容，那么页面是如何渲染出来的呢？

答案是：通过执行引入的 js 代码

CSR 存在的问题：

- 首屏加载慢：请求数据时会带来 I/O 开销，通过 js 来渲染页面则会带来运行时的开销

- 对 seo 不友好，由于没有完整的 html 内容，就无法让搜索引擎爬虫获取到有用的信息

#### SSR 服务端渲染

它的核心特征是：服务器返回完整的 html 内容，换而言之就是浏览器一开始拿到的就是完整的 html 内容，不需要通过 js 的执行来完成页面的渲染

SSR 虽然直接产出了 html 的代码，但是**页面是不可交互**的，因为 DOM 元素事件绑定逻辑仍然需要 JS 才能完成，所以一般的 SSR 项目都会采用同构的架构，也就是在 SSR 页面中加入 CSR 的脚本，完成事件的绑定，这个绑定的过程，也被称为 Hydration(注入)

#### SSG 静态站点生成

它本质上是构建阶段的 SSR，在 build 过程中产出完整的 HTML，它的优点：

- 服务器压力小
- 继承了 SSR 首屏性能和 SEO 的优势

但是它也有一定的局限性，它不适用于数据经常变化的场景，如果一个 10 分钟刷新一次的榜单采用 SSG 方案，项目会进行频繁的构建和部署，也做不到良好的实效性

因此，SSG 更适合用于一些数据变化频率较低的站点，如：文档站点、官方站点、博客等

## 编写和渲染主题组件

根 html 作为根路由的入口，在根目录下创建 index.html 文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- <script type="module" src="./src/runtime/client-entry.tsx"></script> -->
  </body>
</html>
```

编写自定义插件 indexHtmlPlugin
在 src/node 下新建目录 constant 和 plugin 用来存放常量和插件

constant/index.ts

```ts
import path = require("path");

// 根路径
export const rootPath = path.join(__dirname, "..", "..", "..");

// 根 index.html 路径
export const defaultIndexPath = path.join(rootPath, "index.html");

// client-entry.tsx path
export const clientEntryPath = path.join(
  rootPath,
  "src",
  "runtime",
  "client-entry.tsx"
);
```

plugin/indexHtml.ts 存放 indexHtmlPlugin 插件

```ts
import { readFile } from "fs/promises";
import { Plugin } from "vite";
import { clientEntryPath, defaultIndexPath } from "../constant";

export function indexHtmlPlugin(): Plugin {
  return {
    name: "docpress:index-html",
    apply: "serve",
    // 转换 index.html 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文
    // 在body里注入 script标签,就不需要手动去引入
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${clientEntryPath}`,
            },
            injectTo: "body",
          },
        ],
      };
    },
    // devServer
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(defaultIndexPath, "utf-8");
          try {
            // html 热更新
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (error) {
            console.log(error);
            return next(error);
          }
        });
      };
    },
  };
}
```

插件的使用 在 node/dev.ts 中引入并使用插件,使用 vite 官方的 react 热加载库 @vitejs/plugin-react

```ts
import { createServer as createViteDevServer } from "vite";
import { indexHtmlPlugin } from "./plugin/indexHtml";
import pluginInReact from "@vitejs/plugin-react";

export async function createDevServer(root: string = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [indexHtmlPlugin(), pluginInReact()],
  });
}
```

至此，默认主题的构建已经完成

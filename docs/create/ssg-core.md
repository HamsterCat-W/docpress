#### SSG 核心流程开发

服务端入口文件实现
在 src/runtime/ssr-entry.tsx 中编写代码，将 app 组件转换为 html 字符串

```tsx
import { App } from "./App";

import { renderToString } from "react-dom/server";

export function render() {
  return renderToString(<App></App>);
}
```

之后在 constant/index.ts 中获取到 ssr 入口文件的路径

```ts
export const serverEntryPath = path.join(
  rootPath,
  "src",
  "runtime",
  "ssr-entry.tsx"
);
```

创建 build 文件来实现构建功能
src/node/build.ts

```js
// 从vite中引入 build
import { build as viteBuild } from "vite";
import { clientEntryPath, serverEntryPath } from "./constant";


async function bundle(root: string) {
  try {
    // 构建函数
    const buildByFlag = (isServer: boolean) => {
      return viteBuild({
        mode: "production",
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? ".temp" : "build",
          rollupOptions: {
            input: isServer ? serverEntryPath : clientEntryPath,
            output: {
              format: isServer ? "cjs" : "esm",
            },
          },
        },
      });
    };
    // 客户端构建
    const clientViteBuild = () => buildByFlag(false);
    // 服务端构建
    const serverViteBuild = () => buildByFlag(true);

    console.log("🚀 ~ file: build.ts:41 ~ bundle ~ : client and server");
    // 异步构建，避免阻塞，提升性能
    const [clientBundle, serverBundle] = await Promise.all([
      clientViteBuild(),
      serverViteBuild(),
    ]);

    return [clientBundle, serverBundle];
  } catch (error: any) {
    console.log("🚀 ~ file: build.ts:34 ~ bundle ~ error:", error);
  }
}

// 构建函数
export async function build(root: string = process.cwd()) {
  // 1、bundle--client 和 server 端
  const [clientBundle, serverBundle] = await bundle(root);

}
```

创建 build 指令,在 action 中调用 build 方法
src/node/cli.ts

```ts
cli
  .command("build [root]", "build for production")
  .action(async (root: string) => {
    console.log("build", root);
    build(root);
  });
```

此时运行 docpress build 能看到根目录下已经生成了 build、.temp 两个文件夹

之后引入打包好的 ssr 下的 js,(它具有一个 render 函数，将 react 组件转换成 html 字符串)

生成 html 文件
src/node/build.ts

```ts
import { build as viteBuild } from "vite";
import { clientEntryPath, serverEntryPath } from "./constant";
import path = require("path");
import * as fs from "fs-extra";

async function bundle(root: string) {
  try {
    // 构建函数
    const buildByFlag = (isServer: boolean) => {
      return viteBuild({
        mode: "production",
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? ".temp" : "build",
          rollupOptions: {
            input: isServer ? serverEntryPath : clientEntryPath,
            output: {
              format: isServer ? "cjs" : "esm",
            },
          },
        },
      });
    };
    // 客户端构建
    const clientViteBuild = () => buildByFlag(false);
    // 服务端构建
    const serverViteBuild = () => buildByFlag(true);

    console.log("🚀 ~ file: build.ts:41 ~ bundle ~ : client and server");
    const [clientBundle, serverBundle] = await Promise.all([
      clientViteBuild(),
      serverViteBuild(),
    ]);

    return [clientBundle, serverBundle];
  } catch (error: any) {
    console.log("🚀 ~ file: build.ts:34 ~ bundle ~ error:", error);
  }
}

// 构建函数
export async function build(root: string = process.cwd()) {
  // 1、bundle--client 和 server 端
  const [clientBundle, serverBundle] = await bundle(root);
  // 2、引入 server-entry
  const serverEntryPath = path.join(root, ".temp", "ssr-entry.js");
  // 3、服务端渲染，产出 html
  const { render } = require(serverEntryPath);
  renderPage(root, render, clientBundle);
}

// 渲染函数
async function renderPage(root: string, render: any, clientBundle: any) {
  const appHtml = render();
  const html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root">${appHtml}</div>
  </body>
</html>
  `;

  await fs.writeFile(path.join(root, "build/index.html"), html);
  await fs.remove(path.join(root, ".temp"));
}
```

此时运行 docpress build
build/index.html 就是生成的 html 文件，此时启动本地静态资源服务器可以查看页面已经正常显示了，但是点击按钮之后不会有对应的操作结果---->原因是运行在客户端的 js 还没有注入

注入 js
通过 debugger 可以看到 clientBundle 内部的 output 数组中包含了入口文件的 js 构建包，通过它的 fileName 属性可以获取到它的相应的打包路径，通过将其注入到 html 字符串中即可
src/node/build.ts

```ts
import { build as viteBuild } from "vite";
import { clientEntryPath, serverEntryPath } from "./constant";
import path = require("path");
import * as fs from "fs-extra";

async function bundle(root: string) {
  try {
    // 构建函数
    const buildByFlag = (isServer: boolean) => {
      return viteBuild({
        mode: "production",
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? ".temp" : "build",
          rollupOptions: {
            input: isServer ? serverEntryPath : clientEntryPath,
            output: {
              format: isServer ? "cjs" : "esm",
            },
          },
        },
      });
    };
    // 客户端构建
    const clientViteBuild = () => buildByFlag(false);
    // 服务端构建
    const serverViteBuild = () => buildByFlag(true);

    console.log("🚀 ~ file: build.ts:41 ~ bundle ~ : client and server");
    const [clientBundle, serverBundle] = await Promise.all([
      clientViteBuild(),
      serverViteBuild(),
    ]);

    return [clientBundle, serverBundle];
  } catch (error: any) {
    console.log("🚀 ~ file: build.ts:34 ~ bundle ~ error:", error);
  }
}

// 构建函数
export async function build(root: string = process.cwd()) {
  // 1、bundle--client 和 server 端
  const [clientBundle, serverBundle] = await bundle(root);
  // 2、引入 server-entry
  const serverEntryPath = path.join(root, ".temp", "ssr-entry.js");
  // 3、服务端渲染，产出 html
  const { render } = require(serverEntryPath);
  renderPage(root, render, clientBundle);
}

// 渲染函数
async function renderPage(root: string, render: any, clientBundle: any) {
  const clientChunk = clientBundle.output.find(
    (chunk: any) => chunk?.type === "chunk" && chunk?.isEntry
  )?.fileName;

  const appHtml = render();
  const html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script src="${clientChunk}"></script>
  </body>
</html>
  `;

  await fs.writeFile(path.join(root, "build/index.html"), html);
  await fs.remove(path.join(root, ".temp"));
}
```

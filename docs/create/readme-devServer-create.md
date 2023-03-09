## devServer 开发

##### 什么是 devServer

它本质上是一个开发阶段使用的 http 服务器，它主要的功能有：

- 对资源进行编译，并且将编译的结果返回给浏览器
- 模块热更新，能在文件改动时将更新推送到浏览器
- 静态资源服务，支持访问图片等静态资源

实例如：webpack-dev-server 、vite

此项目基于 vite 进行构建，因为 vite 本身具有完整的中间件机制，方便扩展

依赖下载：vite

```bash
pnpm i vite -S
```

之后创建文件 src/node/dev.ts,用来引入 vite 的 createServer 方法

```js
import { createServer as createViteDevServer } from "vite";

export async function createDevServer(root: string = process.cwd()) {
  return createViteDevServer({
    root,
  });
}
```

随后在 cli.ts 文件中将其引入，并使用

```js
cli
  .command("dev [root]", "start dev server")
  .alias("dev")
  .action(async (root: string) => {
    // console.log("dev", root);
    const server = await createDevServer(root);
    await server.listen();
    server.printUrls();
  });
```

随后执行 docpress dev docs，如图所示则创建成功

![image-20230309141927922](/Users/wangguoxuan/Library/Application Support/typora-user-images/image-20230309141927922.png)

如果没有生效，可能是因为 cli.ts 文件在修改后没有编译，通过运行 pnpm start 之后，再次尝试即可

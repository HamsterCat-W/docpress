## cli 脚手架搭建

cli 脚手架的常用功能：信息展示（--version --help）、子命令（ dev build ）、参数解析（--port=8080）、信息交互等

##### 社区工具 Commander.js （nodejs 中最早诞生的 cli 方案）、Yargs （适合复杂的 CLI 开发）、cac (轻量、使用方便、是 Vite 目前所内置的 CLI 搭建方案)

##### 项目使用 cac 工具

##### 开发：

环境构建：全局安装 pnpm npm i -g pnpm

构建项目目录：
|——docpress
| |——bin
| |——src

使用 pnpm 初始化：pnpm init

此时项目目录结构为：
​ |——docpress
​ | |——bin
​ | |——src
​ | |——package.json

依赖安装：typescript @types/node (ts 依赖)

```bash
pnpm i typescript @types/node -D
```

cac (cli 依赖)

```bash
pnpm i cac -S
```

根目录下创建 tsconfig.json 用来配置 ts 的相关配置

```json
{
  "compilerOptions": {
    // 输出文件的位置
    "outDir": "dist",
    "target": "ESNext",
    // 生成的 js 模式
    "module": "commonjs",
    "rootDir": "src"
  }
}
```

在项目目录下创建 src/node/cli.ts，这里实现 cac 的相关功能

之后在 package.json 中配置命令，将 ts 文件打包为 common.js 类型的文件 -w 采用监听模式去编译 ts 文件

```json
{
  "scripts": {
    "start": "tsc -w"
  }
}
```

为使 cli 命令能够生效，需要在 bin 中将生成的 cli.js 引入，在 bin 文件夹下创建 docpress.js 作为 cli 的入口文件，将 dist 下的 cli.js 引入

```js
#!/usr/bin/env node
// nodejs 中cli 入口必须要加这行代码(#!/usr/bin/env node)是个约定，否则提示语法错误
require("../dist/node/cli.js");
```

之后通过使用 npm link 将其 link 到全局，方便验证功能是否可用

```bash
npm link
```

之后执行命令 docpress dev docs 看是否正常输出：dev docs

```bash
docpress dev docs
```

能够看到控制台正常输出：dev docs

至此，cli 工具已经成功搭建起来了

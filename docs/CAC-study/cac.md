#### CAC study

##### 什么是 CAC

cac 是一个用于构建 CLI 脚手架工具的 JS 库

##### 特点

- 轻量级：没有依赖，仅仅是一个单文件
- 方便学习：构建一个简单的 CLI 工具只需要学习四个简单的 Api(cli.option、cli.help、cli.parse、cli.version)
- 由 ts 编写
- 提供像使用默认命令、git 子命令、参数和选项校验、可变参数、嵌套选项、自动生成帮助信息等功能

##### 使用

安装：

```bash
// npm
npm i cac

//yarn
yarn add cac
```

- 在项目中使用的 Api 方法

1、创建 cac 实例

```js
const cli = require("cac")();

const cli = require("cac")("myName"); //之后的命令以 myName 来使用，eg: myName -v 会显示版本号
```

2、创建指令及指令的相关配置

```js
// 1、创建指令
cli.command(name,description,config?)

// config 是一个可选项，它有两个属性
/**
 * config.allowUnknownOptions：Boolean，是否允许在命令行中使用不可知的选项（即没有配置的选项）
 *
 * config.ignoreOptionDefaultValue：Boolean，表示不要在解析时使用配置中的默认值，只仅仅展示在帮助信息中
 */

// 举个🌰
cli.command('build [build]','build my project')

// 2、添加全局配置
cli.option(name,description,config?)

// config 是一个可选项，它有两个属性
/**
 * config.default:为配置项设定一个默认值
 *
 * config.type: 设定选项值的类型
 */

// 🌰
cli.option('-f,--force','全局配置')


// 3、解析方法
cli.parse(argv?)

当这个方法被调用时，cli.rawArgs cli.args cli.options cli.matchedCommand将会变得可用，这也是在控制台输出帮助信息时很重要的方法


// 4、输出版本信息
cli.version(version,customFlags?)

// customFlags 是一个可以自定义输出版本指令的标识，它是一个字符串，具有默认值：'-v,--version'

// 5、输出帮助信息 包含版本
cli.help()

// 6、只显示帮助信息
cli.outputHelp()

// 7、添加全局的 如何使用的信息，在help时显示,不能被子命令使用
cli.usage(text:string)


// 8、对命令进行监听

// 对 foo命令 监听
cli.on('command:foo',()=>{})

// 对默认命令
cli.on('command:!',()=>{})

// 对未知命令
cli.on('command:*',()=>{})


// 9、指令配置api
const command=cli.command('build [...files]','build app')

// 为指令添加配置
command.option()

// 当用户输入与命令匹配时执行的回调函数
command.action(([...args],options)=>{})

// 为指令定义一个别名，⚠️别名里不能有括号
command.alias(name)

// 允许指令使用为定义过的option,默认情况下使用为定义的配置时控制台会报错
command.allowUnknownOptions()

// 提供一个使用🌰，在help时显示
commamd.example(example)
// eg command.example('--env.testApi testApi')

// 为指令提供一个使用详情的描述信息,在help时会显示
command.usage(text)

```

##### 详细 🌰 如下

```js
const cli = require("cac")();

// 添加配置 type <> 为必填项，[]为选填项 cli全局的
cli.option("--type <type>", "Choose a project type", {
  default: "node",
});

// 添加一个命令 rm  <> 为必填项，[]为选填项 action 运行命令时需要做的事
cli.command("rm [dir]", "description").action((dir, options) => {
  console.log("🚀 ~ file: test.js:11 ~ cli.command ~ dir:", dir);
});

//  为 rm 一个命令添加配置 --force 简写为 -f
cli
  .command("rm [dir]", "description")
  .option("-f,--force", "rm 命令配置")
  .action((dir, options) => {
    console.log("🚀 ~ file: test.js:17 ~ cli.command ~ dir:", dir);
    console.log("🚀 ~ file: test.js:15 ~ cli.command ~ options:", options);
  });

// 名字映射 --clear-screen 和 --clearScreen 都会映射到 clearScreen
cli
  .command("dev", "start dev server")
  .option("--clear-screen", "Clear Screen")
  .action((options) => {
    console.log(
      "🚀 ~ file: test.js:23 ~ cli.command ~ options:",
      options.clearScreen
    );
  });

// 否定选项z
cli
  .command("build [build]", "build project")
  .option("--no-config", "Disable config file")
  .option("--config <path>", "use a custom config file");

// 可变选项
cli
  .command("build1 <entry> [...otherFiles]", "Build your app")
  .option("--foo [value]", "Foo option")
  .action((entry, otherFiles, options) => {
    console.log("🚀 ~ file: test.js:43 ~ cli.command ~ entry:", entry);
    console.log(
      "🚀 ~ file: test.js:45 ~ cli.command ~ otherFiles:",
      otherFiles
    );
    console.log("🚀 ~ file: test.js:41 ~ cli.command ~ options:", options);
  });

// 点嵌套选项
cli
  .command("build2", "desc")
  // 添加用法文本
  .usage("how to use")
  .option("--env <env>", "set env")
  // 提供一个使用的🌰
  .example("--env.API_SECRET XXX")
  .action((options) => {
    console.log("🚀 ~ file: test.js:54 ~ cli.command ~ options:", options);
  });

// output help 不包含版本
cli.outputHelp();

// 显示帮助信息 包含版本
cli.help();

// 显示版本信息
cli.version("v0.0.1");

const parsed = cli.parse();

console.log(JSON.stringify(parsed, null, 2));
```

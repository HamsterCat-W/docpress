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

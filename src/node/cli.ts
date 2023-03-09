import { cac } from "cac";

// 获取版本信息
const version = require("../../package.json").version;

const cli = cac("docpress").version(version).help();

cli
  .command("dev [root]", "start dev server")
  .alias("dev")
  .action(async (root: string) => {
    console.log("dev", root);
  });

cli
  .command("build [root]", "build for production")
  .action(async (root: string) => {
    console.log("build", root);
  });

cli.parse();

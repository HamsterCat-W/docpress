import { build as viteBuild } from "vite";
import { clientEntryPath, serverEntryPath } from "./constant";

async function bundle(root: string) {
  // 客户端构建
  const clientViteBuild = () =>
    viteBuild({
      mode: "production",
      root,
      build: {
        outDir: "build",
        rollupOptions: {
          // 入口
          input: clientEntryPath,
          //   出口
          output: {
            format: "esm",
          },
        },
      },
    });
  // 服务端构建
  const serverViteBuild = () =>
    viteBuild({
      mode: "production",
      root,
      build: {
        ssr: true,
        outDir: ".temp",
        rollupOptions: {
          input: serverEntryPath,
          output: {
            format: "cjs",
          },
        },
      },
    });

  console.log("🚀 ~ file: build.ts:41 ~ bundle ~ : client and server");
  await clientViteBuild();
  await serverViteBuild();
}

// 构建函数
export async function build(root: string = process.cwd()) {
  // 1、bundle--client 和 server 端
  await bundle(root);
  // 2、引入 server-entry
  // 3、服务端渲染，产出 html
}

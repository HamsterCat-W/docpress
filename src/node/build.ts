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
  // 3、服务端渲染，产出 html
}

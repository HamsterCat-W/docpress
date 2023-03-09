import { createServer as createViteDevServer } from "vite";
import { indexHtmlPlugin } from "./plugin/indexHtml";

export async function createDevServer(root: string = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [indexHtmlPlugin()],
  });
}

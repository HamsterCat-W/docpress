import { createServer as createViteDevServer } from "vite";
import { indexHtmlPlugin } from "./plugin/indexHtml";
import pluginInReact from "@vitejs/plugin-react";

export async function createDevServer(root: string = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [indexHtmlPlugin(), pluginInReact()],
  });
}

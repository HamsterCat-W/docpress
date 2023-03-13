import { createServer as createViteDevServer } from "vite";
import { indexHtmlPlugin } from "./plugin/indexHtml";
import pluginInReact from "@vitejs/plugin-react";

export function createDevServer(root: string = process.cwd()) {
  return createViteDevServer({
    root,
    server: {
      port: 7779,
      host: true,
      open: "/",
    },
    plugins: [indexHtmlPlugin(), pluginInReact()],
  });
}

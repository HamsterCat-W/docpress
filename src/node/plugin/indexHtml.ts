import { readFile } from "fs/promises";
import { Plugin } from "vite";
import { clientEntryPath, defaultIndexPath } from "../constant";

export function indexHtmlPlugin(): Plugin {
  return {
    name: "docpress:index-html",
    apply: "serve",
    // 转换 index.html 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文
    // 在body里注入 script标签
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${clientEntryPath}`,
            },
            injectTo: "body",
          },
        ],
      };
    },
    // devServer
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(defaultIndexPath, "utf-8");
          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (error) {
            console.log(error);
            return next(error);
          }
        });
      };
    },
  };
}

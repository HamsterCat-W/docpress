import { readFile } from "fs/promises";
import { Plugin } from "vite";
import { defaultIndexPath } from "../constant";

export function indexHtmlPlugin(): Plugin {
  return {
    name: "docpress:index-html",
    apply: "serve",
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(defaultIndexPath, "utf-8");
          try {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (error) {
            console.log(error);
          }
        });
      };
    },
  };
}

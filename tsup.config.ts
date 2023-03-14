import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/node/cli.ts"],
  // 开启bundle模式
  bundle: true,
  outDir: "dist",
  splitting: true,
  format: ["cjs", "esm"],
  dts: true,
  shims: true,
  clean: true,
  // // 使用它可以在生成的 JavaScript 和 CSS 文件的开头插入任意字符串。这样就解决了
  banner: {
    js: 'import { createRequire as createRequire0 } from "module"; const require = createRequire0(import.meta.url);',
  },
});

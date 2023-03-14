import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/node/cli.ts"],
  bundle: true,
  outDir: "dist",
  splitting: true,
  format: ["cjs", "esm"],
  dts: true,
  shims: true,
  clean: true,
});

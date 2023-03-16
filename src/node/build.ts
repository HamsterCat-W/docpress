import { build as viteBuild } from 'vite'
import { clientEntryPath, serverEntryPath } from './constant'
import fs from 'fs-extra'
import path from 'path'

async function bundle(root: string) {
  try {
    // 构建函数
    const buildByFlag = (isServer: boolean) => {
      return viteBuild({
        mode: 'production',
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? '.temp' : 'build',
          rollupOptions: {
            input: isServer ? serverEntryPath : clientEntryPath,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
          }
        }
      })
    }
    // 客户端构建
    const clientViteBuild = () => buildByFlag(false)
    // 服务端构建
    const serverViteBuild = () => buildByFlag(true)

    console.log('🚀 ~ file: build.ts:41 ~ bundle ~ : client and server')
    const [clientBundle, serverBundle] = await Promise.all([
      clientViteBuild(),
      serverViteBuild()
    ])

    return [clientBundle, serverBundle]
  } catch (error: any) {
    console.log('🚀 ~ file: build.ts:34 ~ bundle ~ error:', error)
  }
}

// 构建函数
export async function build(root: string = process.cwd()) {
  // 1、bundle--client 和 server 端
  const [clientBundle, serverBundle] = await bundle(root)
  // 2、引入 server-entry
  const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js')
  // 3、服务端渲染，产出 html
  const { render } = await import(serverEntryPath)
  renderPage(root, render, clientBundle)
}

// 渲染函数
async function renderPage(root: string, render: any, clientBundle: any) {
  const clientChunk = clientBundle.output.find(
    (chunk: any) => chunk?.type === 'chunk' && chunk?.isEntry
  )?.fileName

  const appHtml = render()
  const html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script src="${clientChunk}"></script>
  </body>
</html>
  `

  await fs.writeFile(path.join(root, 'build/index.html'), html)
  await fs.remove(path.join(root, '.temp'))
}

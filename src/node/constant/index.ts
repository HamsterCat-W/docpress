import path = require('path')

// 根路径
export const rootPath = path.join(__dirname, '..')

// 根 index.html 路径
export const defaultIndexPath = path.join(rootPath, 'index.html')

// client-entry.tsx path

export const clientEntryPath = path.join(
  rootPath,
  'src',
  'runtime',
  'client-entry.tsx'
)

export const serverEntryPath = path.join(
  rootPath,
  'src',
  'runtime',
  'ssr-entry.tsx'
)

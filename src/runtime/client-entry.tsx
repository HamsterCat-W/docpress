import { createRoot } from 'react-dom/client'
import { App } from './App'

function renderHtml() {
  let containerDom = document.getElementById('root')
  if (!containerDom) {
    throw new Error('#root dom not found')
  }

  createRoot(containerDom).render(<App></App>)
}

renderHtml()

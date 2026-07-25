import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const dir = new URL('.', import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1')
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' }

http
  .createServer(async (req, res) => {
    let p = decodeURIComponent((req.url || '/').split('?')[0])
    if (p === '/' || p === '') p = '/index.html'
    const fp = join(dir, normalize(p).replace(/^(\.\.[/\\])+/, ''))
    try {
      const data = await readFile(fp)
      res.writeHead(200, { 'content-type': types[extname(fp)] || 'application/octet-stream' })
      res.end(data)
    } catch {
      res.writeHead(404)
      res.end('not found')
    }
  })
  .listen(8099, '127.0.0.1', function () { console.log(`serving: http://127.0.0.1:8099`) })

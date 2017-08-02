const getDataFromCache = require('./getDataFromCache')
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('kcors')

const app = new Koa()
const router = new Router()
const port = process.env.PORT || 5000

app.use(cors())

router.get('/', async (ctx) => {
  const data = await getDataFromCache()
  ctx.body = data
})

router.get('/live.xml', async (ctx) => {
  const data = await getDataFromCache()

  ctx.type = 'text/xml'
  let entry = ''

  if (data.isStreamLive) {
    entry = `<item>
  <title>${data.title}</title>
  <link>http://www.giantbomb.com/#${data.id}</link>
  <description>${data.flavourText}</description>
  <guid isPermaLink="false">${data.id}</guid>
</item>`
  }

  ctx.body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>gb-notifier-server</title>
  <link>http://www.giantbomb.com/</link>
  <description>gb-notifier-server</description>
  ${entry}
</channel>

</rss>`
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, () => {
  console.log(`app listening on 0.0.0.0:${port}`)
})

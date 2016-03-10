import getDataFromCache from './getDataFromCache'
import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())

app.get('/', (req, res) => {
  getDataFromCache()
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        res.json({
          error: err.toString(),
        })
      })
})

app.get('/live.xml', (req, res) => {
  getDataFromCache()
      .then((data) => {
        res.header('Content-Type', 'text/xml')
        let entry = ''
        if (data.isStreamLive) {
          entry = `<item>
  <title>${data.title}</title>
  <link>http://www.giantbomb.com/#${data.id}</link>
  <description>${data.title}</description>
  <guid isPermaLink="false">${data.id}</guid>
</item>`
        }
        res.send(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>gb-notifier-server</title>
  <link>http://www.giantbomb.com/</link>
  <description>gb-notifier-server</description>
  ${entry}
</channel>

</rss>`)
      })
      .catch((err) => {
        res.json({
          error: err.toString(),
        })
      })
})

app.listen(port, () => {
  console.log(`app listening on 0.0.0.0:${port}`)
})

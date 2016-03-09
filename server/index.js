import getDataFromCache from './getDataFromCache'
import express from 'express'

const app = express()
const port = process.env.PORT || 5000

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

app.listen(port, () => {
  console.log(`app listening on 0.0.0.0:${port}`)
})

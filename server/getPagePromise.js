const https = require('https')

module.exports = function getPagePromise (options) {
  return new Promise((resolve, reject) => {
    https
        .get(options, (res) => {
          let content = ''
          res.setEncoding('utf8')
          res.on('data', (chunk) => content += chunk)
          res.on('end', () => resolve(content))
        })
        .on('error', reject)
  })
}

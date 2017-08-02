import https from 'https'

export default function getPagePromise (options) {
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

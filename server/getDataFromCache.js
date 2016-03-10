import { readFile, writeFile } from 'fs'
import getDataFromPage from './getDataFromPage'
import getPagePromise from './getPagePromise'

const options = {
  host: 'www.giantbomb.com',
  port: 80,
  path: '/',
  headers: {
    'user-agent': 'gb-notifier-server (https://www.github.com/mikew/gb-notifier-server)',
  },
}

export default function getDataFromCache () {
  const cacheFile = './t.json'

  return new Promise((resolve, reject) => {
    //console.log(new Date(), 'Checking ...')
    readFile(cacheFile, 'utf8', (errRead, data) => {
      if (errRead) {
        //console.error(errRead)
        data = {}
      } else {
        data = JSON.parse(data)
      }

      if (isDataStale(data)) {
        //console.log(new Date(), 'Data was stale')

        getPagePromise(options).then(getDataFromPage).then((newData) => {
          newData.id = data.id
          newData.fetchedAt = (new Date()).getTime()
          if (newData.title !== data.title) {
            newData.id = Math.random().toString(36)
          }

          writeFile(cacheFile, JSON.stringify(newData), 'utf8', (errWrite) => {
            if (errWrite) {
              reject(errWrite)
              return
            }

            resolve(newData)
          })
        })
      } else {
        //console.log(new Date(), 'Data was fresh')
        resolve(data)
      }
    })
  })
}

function isDataStale ({ fetchedAt = 0 }) {
  // 1 hour
  const staleTime = 1000 * 60 * 60
  //const staleTime = 10 * 1000
  const now = (new Date()).getTime()

  return (now - fetchedAt) > staleTime
}

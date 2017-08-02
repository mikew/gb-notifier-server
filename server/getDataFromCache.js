const { promisify } = require('util')
const fs = require('fs')
const getDataFromPage = require('./getDataFromPage')
const getPagePromise = require('./getPagePromise')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const options = {
  host: 'www.giantbomb.com',
  path: '/',
  headers: {
    'user-agent': 'gb-notifier-server (https://www.github.com/mikew/gb-notifier-server)',
  },
}

module.exports = async function getDataFromCache () {
  const cacheFile = './t2.json'

  let data = {}
  try {
    data = JSON.parse(await readFile(cacheFile, 'utf8'))
  } catch (err) {
    // console.error(err)
  }

  if (isDataStale(data)) {
    const markup = await getPagePromise(options)
    const newData = getDataFromPage(markup)

    newData.id = data.id
    newData.fetchedAt = (new Date()).getTime()

    if (newData.title !== data.title) {
      newData.id = Math.random().toString(36)
    }

    await writeFile(cacheFile, JSON.stringify(newData), 'utf8')

    return newData
  }

  return data
}

function isDataStale ({ fetchedAt = 0 }) {
  // 10 minutes
  const staleTime = 1000 * 60 * 10
  //const staleTime = 10 * 1000
  const now = (new Date()).getTime()

  return (now - fetchedAt) > staleTime
}

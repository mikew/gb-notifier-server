const cheerio = require('cheerio')

module.exports = function getDataFromPage (markup) {
  const $ = cheerio.load(markup)
  const $headerPromo = $('.header-promo')

  const image = $headerPromo.css('background-image')
      .replace('url(', '')
      .replace(')', '')
      .replace('screen_medium', 'scale_super')

  let $link = $headerPromo.find('a.ellipsis')
  if ($link.length === 0) {
    $link = $headerPromo.find('p')
  }

  const url = $link.attr('href')
  const title = $link.text().trim()
  let isStreamLive = $headerPromo.is('.live')
  let startsAt
  let flavourText = $('.kubrick-info p').first().text().trim()

  const $countdown = $headerPromo.find('.js-time-countdown')
  if ($link.length) {
    startsAt = parseInt($countdown.text().trim(), 10) * 1000
    isStreamLive = startsAt < (new Date()).getTime()
  }

  return {
    image,
    url,
    title,
    isStreamLive,
    startsAt,
    flavourText,
  }
}

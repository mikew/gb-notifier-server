import cheerio from 'cheerio'

export default function getDataFromPage (markup) {
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

  const $countdown = $headerPromo.find('.js-time-countdown')
  if ($link.length) {
    startsAt = parseInt($countdown.text().trim(), 10)
    isStreamLive = false
  }

  return {
    image,
    url,
    title,
    isStreamLive,
    startsAt,
  }
}

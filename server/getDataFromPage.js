import cheerio from 'cheerio'

export default function getDataFromPage (markup) {
  const $ = cheerio.load(markup)
  const $headerPromo = $('.header-promo')

  const image = $headerPromo.css('background-image')
      .replace('url(', '')
      .replace(')', '')
      .replace('screen_medium', 'scale_super')

  const $link = $headerPromo.find('a.ellipsis')
  const url = $link.attr('href')
  const title = $link.text()
  const isStreamLive = $headerPromo.is('.live')

  return {
    image,
    url,
    title,
    isStreamLive,
  }
}

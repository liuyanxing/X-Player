import {parse as parseSRTSubtitle } from './parseSRTSubtitle'

const parseSubtitleStartegy = {
  srt(subtitleText) {
    return parseSRTSubtitle(subtitleText)
  },
  ass(subtitleText) {
    return
  }
}
export const parseSubtitle = (type, subtile) => {
  return parseSubtitleStartegy[type](subtile)
}
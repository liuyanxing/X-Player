import { mountSubtitle } from "../lib"
import media from "./media";
class Video extends media{
  constructor() {
    super()
  }
  init() {
    this.removeAttribute("autoplay");
    this.addTextTrack('subtitles', 'zh', 'zh')
    this.addTextTrack('subtitles', 'en', 'en')
  }
  setSubtitle(subtitle) {
    mountSubtitle(subtitle, this.mediaElement)
    this.showTextTrack(this.getTextTrack(0))
  }
  addTextTrack(kind, label, language) {
    this.mediaElement.addTextTrack(kind, label, language)
  }
  showTextTrack(textTrack) {
    textTrack.mode = 'showing'
  }
  hideTextTrack(textTrack) {
    textTrack.mode = 'hidden'
  }
  getWhetherTextTrackShowing(textTrack) {
    return textTrack.mode === 'showing'
  }
  toggleSubtitle(textTracks = this.mediaElement.textTracks) {
    console.log('toggle subtile', textTracks);
    if (!textTracks) return
    console.log('has subtitle');
    Array.from(textTracks).forEach(textTrack => {
      if(this.getWhetherTextTrackShowing(textTrack)) {
        this.hideTextTrack(textTrack)
      } else {
        this.showTextTrack(textTrack)
      }
    })
  }
  getTextTrack(index) {
    return this.mediaElement.textTracks[index]
  }
}

export default new Video();

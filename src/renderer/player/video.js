import { mountSubtitle } from "../lib";
class Video {
  constructor() {
    this.videoElement = null;
  }
  bindVideo(videoElement) {
    this.videoElement = videoElement
    this.initVideo()
  }
  play() {
    if (!this.videoElement) throw new Error('no elemet bind')
    this.videoElement.play();
  }
  pause() {
    if (!this.videoElement) throw new Error('no elemet bind')
    this.videoElement.pause();
  }
  playpause() {
    if (this.videoElement.playing) {
      this.pause();
    } else {
      this.play();
    }
  }
  initVideo(videoElement) {
    this.setAttribute("autoplay", true);
    this.addTextTrack('subtitles', 'zh', 'zh')
    this.addTextTrack('subtitles', 'en', 'en')
  }
  setSubtitle(subtitle) {
    mountSubtitle(subtitle, this.videoElement)
    this.showTextTrack(this.getTextTrack(0))
  }
  setSource(url) {
    if (this.videoElement) {
      this.setAttribute("src", url);
    } else {
      throw new Error("no binded videoElement element");
    }
  }
  setAttribute(attr, value) {
    this.videoElement.setAttribute(attr, value);
  }
  addTextTrack(kind, label, language) {
    this.videoElement.addTextTrack(kind, label, language)
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
  toggleSubtitle(textTracks = this.videoElement.textTracks) {
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
    return this.videoElement.textTracks[index]
  }
}

export default new Video();

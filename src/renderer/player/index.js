import video from "./video";
import audio from "./audio";
class Player {
  constructor(video, audio) {
    this.video = video;
    this.audio = audio;
    this.eventCallback = {
      ended: []
    }
  }
  bindVideoAudio = (videoElement, audioElement) => {
    this.video.bind(videoElement);
    this.audio.bind(audioElement);
    this.video.init()
    this.audio.init()
    this.audio.addEventLister('ended', () => {
      this.fire('ended', this.audio.getCurrentTime())
    })
  }
  setVideoSource = (url) => {
    this.video.setSource(url);
  }
  setAudioSource = (url) => {
    this.audio.setSource(url);
  }
  setSubtitle = (subtitle) => {
    this.video.setSubtitle(subtitle);
  }
  toggleSubtitle = () => {
    this.video.toggleSubtitle();
  }
  play = () => {
    this.video.play();
    this.audio.play();
  }
  pause = () => {
    this.video.pause();
    this.audio.pause();
  }
  playpause = () => {
    this.video.playpause()
    this.audio.playpause()
  }
  checkPaused = () => {
    return this.video.checkPaused() && this.audio.checkPaused()
  }
  on = (event, callback) => {
    if (!this.eventCallback.hasOwnProperty(event)) {
      return
    }
    this.eventCallback[event].push(callback)
  }
  fire = (event, args) => {
    this.eventCallback[event].forEach(callback => {
      callback(args)
    })
  }
}
console.log('player init');
const player = new Player(video, audio);
export default player;

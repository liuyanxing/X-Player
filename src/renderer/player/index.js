import video from "./video";
import audio from "./audio";
class Player {
  constructor(video, audio) {
    this.video = video;
    this.audio = audio;
    console.log(this.audio);
  }
  bindVideoAudio = (videoElement, audioElement) => {
    this.video.bind(videoElement);
    this.audio.bind(audioElement);
    this.video.init()
    this.audio.init()
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
}
console.log('player init');
const player = new Player(video, audio);
export default player;

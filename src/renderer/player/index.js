import video from "./video";
import audio from "./audio";
class Player {
  constructor(video, audio) {
    this.video = video;
    this.audio = audio;
    console.log(this.audio);
  }
  bindVideoAudio = (videoElement, audioElement) => {
    this.video.bindVideo(videoElement);
    this.audio.bindAudio(audioElement);
  }
  setVideoSource = (url) => {
    this.video.setSource(url);
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
    console.log(this.audio.isPlaying());
    if (this.audio.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }
}
console.log('player init');
const player = new Player(video, audio);
export default player;

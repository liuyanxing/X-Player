import video from "./video";
import audio from "./audio";
class Player {
  constructor(video, audio) {
    this.video = video;
    this.audio = audio;
  }
  bindVideoAudio(videoElement, audioElement) {
    this.video.bindVideo(videoElement);
    this.audio.bindAudio(audioElement);
  }
  setVideoSource(url) {
    this.video.setSource(url);
  }
  setSubtitle(subtitle) {
    this.video.setSubtitle(subtitle);
  }
  toggleSubtitle() {
    this.video.toggleSubtitle();
  }
  play() {
    this.video.play();
    this.audio.play();
  }
  pause() {
    this.video.play();
    this.audio.pause();
  }
  playpause() {
    if (this.audio.playing) {
      this.pause();
    } else {
      this.play();
    }
  }
}

const player = new Player(video, audio);
export default player;

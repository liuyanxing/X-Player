class Media{
  constructor() {
    this.mediaElement = null;
  }
  bind(mediaElement) {
    this.mediaElement = mediaElement
  }
  play() {
    if (!this.mediaElement) throw new Error('no elemet bind')
    this.mediaElement.play();
  }
  pause() {
    if (!this.mediaElement) throw new Error('no elemet bind')
    this.mediaElement.pause();
  }
  playpause() {
    if (this.mediaElement.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
  setSource(url) {
    if (this.mediaElement) {
      this.setAttribute("src", url);
    } else {
      throw new Error("no binded mediaElement element");
    }
  }
  setAttribute(attr, value) {
    this.mediaElement.setAttribute(attr, value);
  }
  removeAttribute(attr) {
    this.mediaElement.removeAttribute(attr)
  }
  checkPaused() {
    return this.mediaElement.paused
  }
}

export default Media 

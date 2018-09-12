class Audio {
    constructor() {
        this.audioElement = null
    }
    bindAudio(audioElement) {
        this.audioElement = audioElement
    }
    play() {
        if (!this.audioElement) return
        this.audioElement.play()
    }
    pause() {
        this.audioElement.pause()
    }
    playpause() {
      if (this.audioElement.playing) {
          this.pause()
      } else {
          this.play()
      }
    }
    isPlaying() {
        return !this.audioElement.paused
    }
}
export default new Audio() 
                                    
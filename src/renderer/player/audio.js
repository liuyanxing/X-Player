class Audio {
    constructor() {
        this.audio = null
    }
    bindAudio(audioElement) {
        this.audio = audioElement
    }
    play() {
        this.audio.play()
    }
    pause() {
        this.audio.pause
    }
    playpause() {
      if (this.audio.playing) {
          this.pause()
      } else {
          this.play()
      }
    }
}
export default new Audio() 
                                    
<template>
  <div id='controls'>
    <progress id='progress-bar' @click="seek" min='0' max='100' :value='progressValue'>
    </progress>
    <i v-if = 'showMarkA' class = 'fa fa-map-marker fa-lg mark-point' :style = "{left: markAPosition + '%'}"></i>
    <i v-if = 'showMarkB' class = 'fa fa-map-marker fa-lg mark-point' :style = "{left: markBPosition + '%'}"></i>
    <div class="button-group">
      <i class='control-button fa fa-stop fa-lg' title='stop' onclick='replayVideo();'></i>
      <i class='control-button fa fa-step-backward fa-2x' title='replay' onclick='replayVideo();'></i>	
      <i class='control-button fa fa-play-circle-o fa-3x' title='play' @click="playPauseVideo"></i>
      <i class='control-button fa fa-step-forward fa-2x' title='replay' onclick='replayVideo();'></i>	
      <i class='control-button fa fa-volume-down fa-2x' title='replay' onclick='replayVideo();'></i>	
      <input type="range" id="volume-bar" title="volume" min="0" max="1" step="0.1" value="1">
      <i class='control-button fa fa-arrows-alt fa-1x' title='replay' @click='requestFullScreen'></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      markAPosition: 0,
      markBPosition: 0,
      showMarkA: false,
      showMarkB: false
    };
  },
  props: ["progressPercent", "loopPoint"],
  mounted() {},
  methods: {
    replayVideo() {},
    playPauseVideo() {
      this.$emit("playPauseVideo");
    },
    stopVideo() {},
    muteVolume() {},
    toggleFullScreen() {},
    seek(e) {
      let seekPercent = e.offsetX / e.target.offsetWidth;
      this.$emit("seek", seekPercent);
    },
    requestFullScreen(){
      this.$emit("fullScreen")
    }
  },
  computed: {
    progressValue() {
      if (
        this.showMarkA &&
        this.showMarkB &&
        this.progressPercent * 100 > this.markBPosition
      ) {
        this.$emit("seek", this.markAPosition / 100);
        return;
      }
      return this.progressPercent * 100;
    }
  },
  watch: {
    loopPoint(newPoint, oldPoint) {
      if (newPoint.point === "a") {
        this.showMarkA = true;
        this.showMarkB = false;
        this.markAPosition = newPoint.position;
        console.log("a point", this.markAPosition);
      }
      if (newPoint.point === "b") {
        this.showMarkB = true;
        this.markBPosition = newPoint.position;
        console.log("a point", this.markAPosition);
      }
      if (newPoint.point === "c") {
        this.showMarkA = false;
        this.showMarkB = false;
      }
    }
  }
};
</script>

<style scoped>
.control-button {
  color: rgb(219, 212, 212);
  cursor: pointer;
  margin-right: 20px;
}
progress {
  display: block;
  width: 100%;
  border: 1px solid;
  height: 6px;
  border-style: hidden;
}
progress:hover {
  cursor: pointer;
}
progress::-webkit-progress-bar {
  background: rgb(26, 26, 235);
  border-radius: 3px;
}
progress::-webkit-progress-value {
  background: rgb(120, 76, 241);
  border-radius: 3px;
}
.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
}
.mark-point {
  top: -20px;
  color: yellow;
  position: absolute;
  z-index: 100;
  transform: translate(-6px);
}
</style>


  


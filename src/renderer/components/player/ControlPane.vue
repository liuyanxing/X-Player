
<template>
  <div id='control-pane'>
    <progress id='progress-bar' @click="seek" min='0' max='100' :value='progressValue'>
    </progress>
    <i v-if = 'showMarkA' class = 'fa fa-map-marker fa-lg mark-point' :style = "{left: markAPosition + '%'}"></i>
    <i v-if = 'showMarkB' class = 'fa fa-map-marker fa-lg mark-point' :style = "{left: markBPosition + '%'}"></i>
    <div class="button-group">
      <i class='control-button fa fa-stop fa-lg' title='stop' onclick='replayVideo();'></i>
      <i class='control-button fa fa-step-backward fa-2x' title='replay' onclick='replayVideo();'></i>	
      <i class='control-button fa fa-play-circle-o fa-3x' title='play' @click="player.playpause"></i>
      <i class='control-button fa fa-step-forward fa-2x' title='replay' onclick='replayVideo();'></i>	
      <i class='control-button fa fa-volume-down fa-2x' title='replay' onclick='replayVideo();'></i>	
      <input type="range" id="volume-bar" title="volume" min="0" max="1" step="0.1" value="1">
      <i class='control-button fa fa-arrows-alt fa-1x' title='replay' @click='requestFullScreen'></i>
    </div>
  </div>   
</template>
<script>
import player from '../../player'
export default {
  data() {
    return {
      player
    }
  }    
}
</script>
<style>
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

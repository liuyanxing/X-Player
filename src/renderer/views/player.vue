<template>
  <main>
    <video ref="video"></video>
    <audio ref="audio"></audio>
    <!-- <control-pane></control-pane> -->
  </main>
</template>

<script>
import { ipcRenderer } from "electron";
import player from "../player";
import ControlPane from "../components/player/ControlPane"
import util from "../../util"
import { parseSubtitle } from "../lib";
import { keymap } from '../config'

const SURPPORTED_VIDEO_FORMATE = ['mp4', 'ogg', 'mkv']
const SURPPORTED_SUBTITLE_FORMATE = ['srt', 'ass']
export default {
  data() {
    return {
      files: {
        video: {origin: null, url: ''},
        subtitle: {origin: null, text: ''}
      }
    }
  },
  mounted() {
    player.bindVideoAudio(this.$refs.video, this.$refs.audio)
    this.bindDragOpenFile()
    this.bindKeymap(keymap)
  },
  methods: {
    bindKeymap(keymap) {
      document.addEventListener('keyup', e => {
        console.log(e.keyCode);
        keymap[e.keyCode]()
      })
    },
    bindDragOpenFile() {
      document.ondragover = document.ondrop = e => e.preventDefault()
      document.body.ondrop = e => this.handleDropOpenFile(e)
    },
    handleDropOpenFile(e) {
      e.preventDefault()
      this.handleFiles(e.dataTransfer.files)
    },
    handleFiles(files) {
      if(files.length > 2) {
        return
      }
      Array.from(files).forEach(file => {
        if(this.checkVideoSupported(file)) {
          this.files.video = {
            origin: file,
            url: util.getUrlFromFile(file)
          }
          player.setVideoSource(util.getUrlFromFile(file))
          this.sendToIpcMain('got-video', file.path)
        }
        if(this.checkSubtitleSupported(file)) {
          util.getTextFromFile(file).then(res => {
            console.log(res);
            this.files.subtitle = {
              origin: file,
              text: res
            }
            player.setSubtitle(parseSubtitle(util.getFileType(file.name), res)) 
          }).catch(res => {
            throw new Error(res)
          })
        }
     })
    },
    checkVideoSupported(file) {
      let fileType = util.getFileType(file.name)
      return SURPPORTED_VIDEO_FORMATE.includes(fileType)
    },
    checkSubtitleSupported(file) {
      let fileType = util.getFileType(file.name)
      return SURPPORTED_SUBTITLE_FORMATE.includes(fileType)
    },
    sendToIpcMain(message, arg) {
      ipcRenderer.send(message, arg)
    }
  }
};
</script>

<style scoped>
main {
  height: 100vh;
}
video {
  width: 100%;
  height: 100%;
  background-color: black;
}
#waveform {
  position: absolute;
  bottom: 60px;
  width: 100%;
  height: 160px;
  background-color: white;
}
</style>
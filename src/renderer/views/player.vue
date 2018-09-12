<template>
  <main>
    <video ref="video"></video>
    <audio ref="audio"></audio>
    <!-- <control-pane></control-pane> -->
    <div v-if="loading" class="loading-container">
      <loading></loading>
    </div>
  </main>
</template>

<script>
import { ipcRenderer } from "electron";
import player from "../player";
import ControlPane from "../components/player/ControlPane"
import util from "../../util"
import { parseSubtitle } from "../lib";
import { keymap } from '../config'
import Loading from '../components/Loading'
const SURPPORTED_VIDEO_FORMATE = ['mp4', 'ogg', 'mkv']
const SURPPORTED_SUBTITLE_FORMATE = ['srt', 'ass']
export default {
  data() {
    return {
      files: {
        video: {origin: null, url: ''},
        subtitle: {origin: null, text: ''}
      },
      loading: true
    }
  },
  components: { ControlPane, Loading},
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
    bindIpcRenderHandler() {
      ipcRenderer.on('finish-convert', this.startPlay)
    },
    startPlay(event, arg) {
      player.play()
    },
    setAudioUrl(event, arg) {
      player.setAudioUrl(`../data/audio/${arg}`)
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
    closeLoading() {
      this.loading = false
    },
    openLoading() {
      this.loading = true
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
.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  margin-top: 40vh;
}
#waveform {
  position: absolute;
  bottom: 60px;
  width: 100%;
  height: 160px;
  background-color: white;
}
</style>
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
import helper from "../../helper"
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
      loading: true,
      audioConverteCompletely: false,
      convertedAudioUrl: null
    }
  },
  components: { ControlPane, Loading},
  mounted() {
    player.bindVideoAudio(this.$refs.video, this.$refs.audio)
    this.bindDragOpenFile()
    this.bindKeymap(keymap)
    this.bindIpcRenderHandler()
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
      ipcRenderer.on('audio-partially-converted', this.handleAudioPartillyConverted.bind(this))
      ipcRenderer.on('audio-completely-converted', this.handleAudioCompletelyConverted.bind(this))
      ipcRenderer.on('log', (event, log) => {
        console.log('main process  ', log)
      })
    },
    setConvertedAudioUrl(fileName) {
      this.convertedAudioUrl = `../data/audio/${fileName}`
    },
    handleAudioPartillyConverted(event, fileName) {
      console.log('audio partially convert', fileName);
      this.setConvertedAudioUrl(fileName)
      player.setAudioSource(this.convertedAudioUrl)
      player.play()
    },
    handleAudioCompletelyConverted(event, fileName) {
      this.audioConverteCompletely = true
      this.setConvertedAudioUrl(fileName)
      this.setAudioUrl(this.convertedAudioUrl)
      player.play()
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
            url: helper.getUrlFromFile(file)
          }
          player.setVideoSource(helper.getUrlFromFile(file))
          ipcRenderer.send("got-video", file.path);
        }
        if(this.checkSubtitleSupported(file)) {
          helper.getTextFromFile(file).then(res => {
            console.log(res);
            this.files.subtitle = {
              origin: file,
              text: res
            }
            player.setSubtitle(parseSubtitle(helper.getFileType(file.name), res)) 
          }).catch(res => {
            throw new Error(res)
          })
        }
     })
    },
    checkVideoSupported(file) {
      let fileType = helper.getFileType(file.name)
      return SURPPORTED_VIDEO_FORMATE.includes(fileType)
    },
    checkSubtitleSupported(file) {
      let fileType = helper.getFileType(file.name)
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
<template>
<div id="main">
	<video-syn-audio id="player" @activeCue="getActiveCue" :playerShortcut="playerShortcut" :src="videoSrc" :audioSrc = "audioSrc" :audioConverted="audioConverted" :subtitle="subtitle"></video-syn-audio>
  <div id="waveform" v-show="showWaveForm"></div>
</div>
</template>

<script>
import { ipcRenderer } from "electron";
import videoSynAudio from "./VideoSynAudio";
import { parse as srtParse } from "../../srtUtils";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions.js";

export default {
  data() {
    return {
      videoSrc: null,
      audioSrc: null,
      audioConverted: false,
      subtitle: null,
      wavesurfer: null,
      audioBlob: null,
      playerShortcut: null,
      playerState: null,
      showWaveForm: false,
      mainShortcutHandlers: null,
      activeCueAndDuration: null,
      markPointA: 0,
      markPointB: 0
    };
  },
  components: { videoSynAudio },
  mounted() {
    this.wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple",
      plugins: [RegionsPlugin.create({})]
    });
    this.initWavesurfer(this.wavesurfer);
    this.bindShorcut();
    this.initIpcRenderListener();
    this.initMainShortcutHandlers(this.wavesurfer);
  },
  methods: {
    getActiveCue(arg) {
      this.activeCueAndDuration = arg;
    },
    initWavesurfer(wavesurfer) {
      let region = null;
      let readyEventFired = false;
      wavesurfer.on("ready", () => {
        if (!readyEventFired) {
          wavesurfer.enableDragSelection({});
          readyEventFired = true;
        }
        this.start = 0;
        this.end = wavesurfer.getDuration();
      });

      wavesurfer.on("region-created", reg => {
        if (region) region.remove();
      });
      wavesurfer.on("region-update-end", reg => {
        this.start = reg.start;
        this.end = reg.end;
        region = reg;
        reg.play();
      });
      wavesurfer.on("region-dblclick", reg => {
        reg.remove();
        wavesurfer.pause();
      });
      wavesurfer.on("pause", () => {
        if (this.loop && !this.paused) wavesurfer.play(this.start, this.end);
      });
    },
    initMainShortcutHandlers(wavesurfer) {
      this.mainShortcutHandlers = {
        "32": () => {
          //space
          if (wavesurfer.isPlaying()) {
            this.paused = true;
            wavesurfer.pause();
          } else {
            this.paused = false;
            let start = wavesurfer.getCurrentTime();
            if (Math.abs(start - this.end) < 0.02) {
              wavesurfer.play(this.start, this.end);
            } else {
              if (start > this.end) start = this.start;
              wavesurfer.play(start, this.end);
            }
          }
        },
        //L
        "76": () => {
          this.loop = !this.loop;
        },
        //w
        "87": () => {
          if (this.activeCueAndDuration) {
            this.showWaveForm = !this.showWaveForm;
            if (this.showWaveForm) {
              this.pausePlayer();
              this.displaySentence(this.activeCueAndDuration, this.audioBlob);
            } else {
              this.playPlayer();
              this.wavesurfer.clearRegions();
            }
          }
        }
      };
    },
    bindShorcut() {
      document.ondragover = document.ondrop = ev => {
        ev.preventDefault();
      };
      document.body.ondrop = ev => {
        ev.preventDefault();
        let inputFile = ev.dataTransfer.files[0];
        let fileName = inputFile.name;
        let subFileExtension = /(ass|srt)$/g.exec(fileName);
        let videFileExtension = /(mkv|mp4)$/g.exec(fileName);

        if (subFileExtension) {
          let reader = new FileReader();
          reader.onload = e => {
            if (subFileExtension[1] === "srt") {
              this.subtitle = {
                type: "srt",
                content: e.target.result
              };
            } else if (subFileExtension[1] === "ass") {
            }
          };
          reader.readAsText(inputFile);
        }
        if (videFileExtension) {
          let videoURL = URL.createObjectURL(inputFile);
          this.videoSrc = videoURL;
          ipcRenderer.send("get-video-source", inputFile.path);
        }
      };
      document.addEventListener("keyup", e => {
         let keyCode = e.keyCode;
        if (
          (this.showWaveForm || keyCode === 87) &&
          this.mainShortcutHandlers.hasOwnProperty(keyCode)
        ) {
          this.mainShortcutHandlers[keyCode]();
          return;
        }
        this.playerShortcut = {
          keyCode: keyCode,
          timestamp: new Date().getTime()
        };
      });
      document.addEventListener("dblclick",e=>{
        ipcRenderer.send("request-full-screen");
      })
    },
    initIpcRenderListener() {
      ipcRenderer.on("audio-format-convert-finished", (event, arg) => {
        this.audioConverted = true;
      });
      ipcRenderer.on("audio-already-exist", (event, arg) => {
        this.audioSrc = `../data/audio/${arg}`;
        this.audioConverted = true;
      });
      ipcRenderer.on("got-audio-name", (event, arg) => {
        this.audioSrc = `../data/audio/${arg}`;
      });
      ipcRenderer.on("get-audio-arraybuffer", (event, arg) => {
        this.audioBlob = new Blob([arg.buffer]);
      });
    },
    displaySentence(activeCueAndDuration, audioBlob) {
      let { cue, duration } = activeCueAndDuration;
      let start = cue.startTime;
      let end = cue.endTime;
      let sliceStart = start / duration * audioBlob.size;
      let sliceEnd = end / duration * audioBlob.size;
      let slicedFile = audioBlob.slice(sliceStart, sliceEnd);
      this.wavesurfer.loadBlob(slicedFile);
      this.wavesurfer.once("ready", () => {
        this.wavesurfer.play();
      });
    },
    playPlayer() {
      this.playerShortcut = {
        keyCode: 300, //customized keycode
        timestamp: new Date().getTime()
      };
    },
    pausePlayer() {
      this.playerShortcut = {
        keyCode: 301, //customized keycode
        timestamp: new Date().getTime()
      };
    }
  }
};
</script>

<style scoped>
#main {
  height: 100%;
}
#player {
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
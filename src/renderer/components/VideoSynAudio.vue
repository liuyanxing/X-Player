<template>
  <div id="videoForMkv" :style="{cursor:cursorHidden}" @mousemove="showOrHideControlBar($event)">
  	<video id="videoPlayer" @playing="playVideoAudio" @pause="pauseVideoAudio" @timeupdate="updateProgress" :src="src">
      <track kind="subtitles" srclang="zh" label="Chinese" default/>
      <track kind="subtitles" srclang="en" label="English"/>
  	</video>
    <audio id="mkvAudio" :src="audioSrcRandom"></audio>
    <control-bar :hidden="controlBarHidden" id="control-bar" :progressPercent = "progressPercent" :loopPoint="loopPoint"
       @seek="seek" @playPauseVideo = "playPauseVideo" @fullScreen = "requestFullScreen"></control-bar>
  </div>
</template>

<script>
import { parse as srtParse } from "../../srtUtils";
import { ipcRenderer } from "electron";
import controlBar from "./PlayerControlBar";
import { setInterval } from "timers";
export default {
  data() {
    return {
      mkvPlayer: null,
      mkvAudio: null,
      audioSrcRandom: null,
      chSubTrack: null,
      enSubTrack: null,
      shortcutHandlers: null,
      enCues: null,
      chCues: null,
      activeCue: null,
      progressPercent: 0,
      loopPoint: null,
      videoForMkv: null,
      controlBarHidden: false,
      hasVideo: false,
      cursorHidden: "default",
      mousePostion: null,
      lastMoveTime: 0
    };
  },
  mounted() {
    this.initData();
    this.initPlayer();
  },
  props: ["src", "audioSrc", "audioConverted", "subtitle", "playerShortcut"],
  components: { controlBar },
  methods: {
    initData() {
      this.mkvPlayer = document.getElementById("videoPlayer");
      this.mkvAudio = document.getElementById("mkvAudio");
      this.videoForMkv = document.getElementById("main");
    },
    initPlayer() {
      this.initShortcutHandlers();
      this.mkvPlayer.onloadmetadata = () => {};
      this.mkvPlayer.oncanplay = () => {
        this.controlBarHidden = true;
        this.hasVideo = true;
      };

      window.setInterval(() => {
        let nowMs = new Date().getTime();
        if (nowMs - this.lastMoveTime > 1000) {
          this.cursorHidden = "none";
        }
      }, 1000);
    },
    synWithAudio() {
      let offsetTime = 0.1;
      this.mkvAudio.currentTime = this.mkvPlayer.currentTime + offsetTime;
    },
    pauseVideoAudio() {
      this.mkvAudio.pause();
      this.mkvPlayer.pause();
    },
    playVideoAudio() {
      this.mkvPlayer.play();
      this.mkvAudio.play();
      this.synWithAudio();
    },
    playPauseVideo() {
      if (this.mkvPlayer.paused) {
        this.playVideoAudio();
      } else {
        this.pauseVideoAudio();
      }
    },
    loadAudio() {
      this.$nextTick(() => {
        this.mkvAudio.load();
        this.playVideoAudio();
      });
    },
    loadAudioIntervally(ms) {
      let timer = setTimeout(() => {
        if (!this.audioConverted) {
          this.loadAudioIntervally();
          this.audioSrcRandom = this.audioSrc + "?cb=" + new Date().getTime();
          this.loadAudio();
        } else {
          clearTimeout(timer);
        }
      }, 10000);
    },
    switchSubtitle() {
      if (this.chSubTrack.mode === "showing") {
        this.enSubTrack.mode = "showing";
        this.chSubTrack.mode = "hidden";
      } else {
        this.enSubTrack.mode = "hidden";
        this.chSubTrack.mode = "showing";
      }
    },
    initShortcutHandlers() {
      this.shortcutHandlers = {
        "83": this.switchSubtitle, //s
        //space
        "32": () => {
          this.mkvPlayer.paused
            ? this.playVideoAudio()
            : this.pauseVideoAudio();
        },
        //left arrow
        "37": () => {
          let activeCueIndex, preCueIndex;
          if (!this.activeCue || this.activeCue.id === "0") {
            return;
          } else {
            activeCueIndex = this.activeCue.id;
            preCueIndex = parseInt(activeCueIndex) - 1;
          }
          let preCue = this.enCues[preCueIndex];
          this.jumpToTime(preCue.startTime);
        },
        //right arrow
        "39": () => {
          let activeCueIndex, nextCueIndex;
          if (!this.activeCue) {
            nextCueIndex = 0;
          } else {
            activeCueIndex = this.activeCue.id;
            if (activeCueIndex == this.enCues.length - 1) {
              nextCueIndex = activeCueIndex;
            } else {
              nextCueIndex = parseInt(activeCueIndex) + 1;
            }
          }
          let nextCue = this.enCues[nextCueIndex];
          this.jumpToTime(nextCue.startTime);
        },
        // play player customized keycode
        "300": () => {
          this.playVideoAudio();
        },
        // play player customized keycode
        "301": () => {
          this.pauseVideoAudio();
        },
        //a
        "65": () => {
          let time;
          if (this.activeCue) {
            time = this.activeCue.startTime;
          }
          this.loopPoint = {
            point: "a",
            position: time / this.mkvPlayer.duration * 100
          };
        },
        //b
        "66": () => {
          let time;
          if (this.activeCue) {
            time = this.activeCue.endTime;
          }
          this.loopPoint = {
            point: "b",
            position: time / this.mkvPlayer.duration * 100
          };
        },
        "67": () => {
          this.loopPoint = {
            point: "c",
            timestamp: new Date().getTime()
          };
        }
      };
    },
    jumpToTime(aimTime) {
      this.mkvPlayer.currentTime = aimTime;
      this.synWithAudio();
    },
    removeCues(textTrack) {
      let cues = textTrack.cues;
      let cuesLen = cues.length;
      for (let i = 0; i < cuesLen; i++) {
        this.$nextTick(() => {
          textTrack.removeCue(cues[i]);
        });
      }
    },
    seek(progressPercent) {
      this.progressPercent = progressPercent;
      this.mkvPlayer.currentTime = this.mkvPlayer.duration * progressPercent;
    },
    updateProgress() {
      this.progressPercent =
        this.mkvPlayer.currentTime / this.mkvPlayer.duration;
    },
    requestFullScreen() {
      ipcRenderer.send("request-full-screen");
    },
    showOrHideControlBar(e) {
      let bodyHeight = document.body.clientHeight;
      let mouseToBottom = bodyHeight - e.clientY;

      this.lastMoveTime = new Date().getTime();
      this.cursorHidden = "default";
      if (this.hasVideo) {
        this.controlBarHidden = mouseToBottom < 100 ? false : true;
      }
    }
  },
  watch: {
    audioSrc(newAudioSrc, oldAudioSrc) {
      if (!this.audioConverted) {
        setTimeout(() => {
          this.loadAudio();
          this.playVideoAudio();
          this.loadAudioIntervally();
          setTimeout(() => {
            let audioTempDuration = this.mkvAudio.duration;
          }, 1000);
        }, 5000);
      }
      this.audioSrcRandom = newAudioSrc + "?cb=" + new Date().getTime();
    },
    audioConverted() {
      this.audioSrcRandom = this.audioSrc + "?cb=" + new Date().getTime();
      this.loadAudio();
    },
    subtitle(newSubtitle, oldSubtitle) {
      this.chSubTrack = this.mkvPlayer.textTracks[0];
      this.enSubTrack = this.mkvPlayer.textTracks[1];
      if (this.chSubTrack.cues.length) {
        this.removeCues(this.chSubTrack);
        this.removeCues(this.enSubTrack);
      }

      let { type, content } = newSubtitle;
      let parsedSubtitle, chSub, enSub, duSub;

      let chTextTrack = this.chSubTrack;
      let enTextTrack = this.enSubTrack;

      enTextTrack.mode = "hidden";
      chTextTrack.mode = "showing";
      if (type === "srt") {
        parsedSubtitle = srtParse(content);
        let vvtSubtitle = parsedSubtitle.map((value, index, self) => {
          duSub = value.text.split("\n");
          chSub = duSub[0];
          enSub = duSub[1];
          let cnVTTCue = new VTTCue(
            value.start / 1000,
            value.end / 1000,
            chSub
          );
          cnVTTCue.id = index;
          chTextTrack.addCue(cnVTTCue);

          let enVTTCue = new VTTCue(
            value.start / 1000,
            value.end / 1000,
            enSub
          );
          enVTTCue.id = index;
          enVTTCue.onenter = e => {
            this.activeCue = e.currentTarget;
            this.$emit("activeCue", {
              cue: this.activeCue,
              duration: this.mkvAudio.duration
            });
          };
          enTextTrack.addCue(enVTTCue);
        });
      }
      this.chCues = this.chSubTrack.cues;
      this.enCues = this.enSubTrack.cues;
    },
    playerShortcut(newValue, oldValue) {
      let keyCode = newValue.keyCode;

      if (this.shortcutHandlers.hasOwnProperty(keyCode)) {
        this.shortcutHandlers[keyCode]();
      }
    }
  }
};
</script>
 
<style type="text/css">
#video-for-mkv {
  width: 100%;
  height: 100%;
}
#videoPlayer {
  width: 100%;
  height: 100%;
}
#control-bar {
  position: relative;
  top: -80px;
}
#control-bar {
  margin: 0 auto;
  width: 90%;
}
</style>
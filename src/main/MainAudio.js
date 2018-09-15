let path = require("path");
let childPorcessExec = require("child_process").exec;
let crypto = require("crypto");
let fs = require("fs");

let ffempg = path.join(__dirname, "../../", "/bin", "/ffmpeg.exe");
let dataPath = path.join(__dirname, "../../", "/data");
let audioPath = path.join(dataPath, "/audio");

import log from './ConLogToBrowser'
import helper from '../helper'
class MainAudio {
  constructor() {
    this.audioArray = null
    this.videoFilePath = null
    this.audioSavaPath = null
    this.audioFileName = null
    this.convertQuality = 64
  }
  setAudio(audioArray) {
    this.audioArray = audioArray
  }
  convertToMp3({start, end, duration}) {
    return this.generateFileName()
        .then(fileName => {
          this.audioFileName = fileName
          this.setAudioSavePath(fileName)
          if (helper.checkFileIsExisted(this.audioSavaPath)) {
            return new Promise(resolve => resolve(this.audioFileName))
          }
          return this.convert({start, end, duration})
        })
  }
  convert({start, end, duration}) {
    return new Promise((resolve, reject) => {
      let execCommand
      if (!end && !duration) {
        execCommand = `${ffempg} -i ${this.getVideoFilePath()} -ab 64k ${this.audioSavaPath}`
      } else if (end) {
        execCommand = `${ffempg} -i ${this.getVideoFilePath()} -ss ${start} -to ${end} -ab 64k ${this.audioSavaPath}`
      } else {
        execCommand = `${ffempg} -i ${this.getVideoFilePath()} -ss ${start} -t ${duration} -ab 64k ${this.audioSavaPath}`
      }
      childPorcessExec(execCommand, (err, stdout, stderr) => resolve(this.audioFileName))
    })
  }
  generateFileName() {
    return new Promise((resolve, reject) => {
      try {
        childPorcessExec(`${ffempg} -i ${this.getVideoFilePath()}`, (err, stdout, stderr) => {
          let videoMetadata = /Metadata:([\s\S]*)At least one output file/g.exec(stderr)[1];
          let audioFileName = crypto.createHash("md5").update(videoMetadata).digest("hex") + '.mp3';
          resolve(audioFileName)
        })
      } catch (error) {
        reject(error)        
      }
    })
  }
  setVideoFilePath(videoFilePath) {
    this.videoFilePath = videoFilePath
  }
  getVideoFilePath() {
    return this.videoFilePath
  }
  setAudioSavePath(fileName) {
    this.audioSavaPath = path.join(audioPath, fileName)
  }
}

export default new MainAudio()

let path = require("path");
let childPorcessExec = require("child_process").exec;
let crypto = require("crypto");
let fs = require("fs");

let ffempg = path.join(__dirname, "../../", "/bin", "/ffmpeg.exe");
let dataPath = path.join(__dirname, "../../", "/data");
let audioPath = path.join(dataPath, "/audio");

class MainAudio {
  constructor() {
    this.audioArray = null
    this.videoFilePath = null
  }
  setAudio(audioArray) {
    this.audioArray = audioArray
  }
  convertToMp3() {
    if (!this.audioArray) throw new Error('no audio array')

    this.generateFileName()
        .then(fileName => {
          let audioFileSavePath = path.join(AUDEIODIRECTORY, fileName)
          return this.convert(audioFileSavePath)
        })
  }
  convert(savePath) {
    return new Promise((resolve, reject) => {
      childPorcessExec(
        //ffempg -i inputeFile -ss 00:00:00.000 -t 00:00:00 -ab 64k
        `${ffempg} -i ${this.getVideoFilePath()} -ab 64k ${savePath}`,
        (err, stdout, stderr) => {
          resolve();
        }
      )
    })
  }
  generateFileName() {
    new Promise((resolve, reject) => {
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
    return this.audioFileName
  }
}

export default new MainAudio()

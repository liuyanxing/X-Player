import { reject } from "bluebird-lst";

let path = require("path");
let childPorcessExec = require("child_process").exec;
let crypto = require("crypto");
let fs = require("fs");

let ffempg = path.join(__dirname, "../../", "/bin", "/ffmpeg.exe");
let dataPath = path.join(__dirname, "../../", "/data");
let audioPath = path.join(dataPath, "/audio");

export default (path, duration) => {
  return new Promise((reslove, reject) => {
    childPorcessExec(`${ffempg} -i ${arg}`, (err, stdout, stderr) => {
      let videoMetaData = /Metadata:([\s\S]*)At least one output file/g.exec(stderr)[1];
      let convertedAudioName = crypto.createHash("md5").update(videoMetaData).digest("hex") + '.mp3'
      return convertedAudioName
    })
  childPorcessExec(`${ffempg} -i ${arg}`, (err, stdout, stderr) => {
    let infoReg = /Metadata:([\s\S]*)At least one output file/g;
    let res = infoReg.exec(stderr);

    let videoMetadata = res[1];
    let videoMetadataHash = crypto
      .createHash("md5")
      .update(videoMetadata)
      .digest("hex");
    let audioName = `${videoMetadataHash}.mp3`;
    let audioOFVideo = path.join(audioPath, `/${audioName}`);

    event.sender.send("got-audio-name", audioName);
    try {
      fs.accessSync(audioOFVideo, fs.constants.F_OK);
    } catch (e) {
      childPorcessExec(
        `${ffempg} -i ${arg} -ab 64k ${audioOFVideo}`,
        (err, stdout, stderr) => {
          event.sender.send("audio-format-convert-finished", audioName);
        }
      );
      return;
    }
    event.sender.send("audio-already-exist", audioName)
    let audioFileBuffer = fs.readFileSync(audioOFVideo)
    let audioArrBuffer = Uint8Array.from(audioFileBuffer)
    event.sender.send("get-audio-arraybuffer", audioArrBuffer);
  });
}
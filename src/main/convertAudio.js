import mainAudio from "./MainAudio";

export default (videoFilePath) => {
  mainAudio.setVideoFilePath(videoFilePath)
  return mainAudio.convertToMp3()
}
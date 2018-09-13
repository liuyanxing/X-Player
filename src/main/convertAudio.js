import mainAudio from "./MainAudio";

export default (videoFilePath, convertType) => {
  mainAudio.setVideoFilePath(videoFilePath)
  if (convertType === 'partial') {
    return mainAudio.convertToMp3({start:0, duration: 180})
  }
  if (convertType === 'all') {
    return mainAudio.convertToMp3({start: 0})
  }
}
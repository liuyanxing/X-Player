import mainAudio from "./MainAudio";

export default (videoFilePath, convertType, start = 0) => {
  if (videoFilePath) {
    mainAudio.setVideoFilePath(videoFilePath)
  }
  if (convertType === 'partial') {
    mainAudio.setAudioFileNameSuffix('temp')
    return mainAudio.convertToMp3({start, duration: 10})
  }
  if (convertType === 'all') {
    mainAudio.setAudioFileNameSuffix(null)
    return mainAudio.convertToMp3({start})
  }
}
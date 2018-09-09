function VTTCueFactory({start, end, text, index}) {
  let vttCue = new VTTCue(start, end, text)
  vttCue.index = index
  return vttCue
}
export default (subtitle, video) => {
  let zhTextTrack = video.textTracks[0]
  let enTextTrack = video.textTracks[1]
  subtitle.map((value, index, self) => {
    let zhEnSubtitle = value.text.split("\n");
    zhTextTrack.addCue(VTTCueFactory({
      start: value.start / 1000,
      end: value.end / 1000,
      text: zhEnSubtitle[0],
      index
    }));
    enTextTrack.addCue(VTTCueFactory({
      start: value.start / 1000,
      end: value.end / 1000,
      text: zhEnSubtitle[1],
      index
    }));
  });
}
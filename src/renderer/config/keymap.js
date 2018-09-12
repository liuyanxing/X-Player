import player from "../player"
const SPACE = 32
const LOWER_A = 65
const LOWER_B = 66
const LOWER_C = 67
const LOWER_L = 76
const LOWER_W = 87
const LOWER_H = 72
const LEFT_ARROW = 37
const RIGHT_ARROW = 39
const keymap = {
  [SPACE]: player.playpause,
  [LOWER_H]: player.toggleSubtitle
}
export default keymap
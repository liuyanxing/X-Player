import media from "./media";
class Audio extends media {
  constructor() {
    super();
  }
  init() {
    this.removeAttribute("autoplay");
  }
}
export default new Audio();

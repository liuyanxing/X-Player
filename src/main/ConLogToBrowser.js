import { ipcMain } from "electron";

class Log{
  setWin(win) {
    this.win = win
  }
  send(log) {
    console.log('win', this.win.webContents.send);
    this.win.webContents.send('log', arguments)
  }
}

export default new Log()
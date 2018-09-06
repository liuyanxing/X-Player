import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
let path = require("path");
let childPorcessExec = require("child_process").exec;
let crypto = require("crypto");
let fs = require("fs");

let ffempg = path.join(__dirname, "../../", "/bin", "/ffmpeg.exe");
let dataPath = path.join(__dirname, "../../", "/data");
let audioPath = path.join(dataPath, "/audio");
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = path.join(__dirname, "/static").replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    resizable:true,
  });

  mainWindow.loadURL(winURL);
  mainWindow.setMenu(null)
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", ()=>{
  createWindow();
  globalShortcut.register('ESC', () => {
    mainWindow.setFullScreen(false);
  })
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
  console.log("mainwindow created");
});

ipcMain.on("get-video-source", (event, arg) => {
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
});

ipcMain.on("request-full-screen",()=>{
  if(mainWindow.isFullScreen()){
    mainWindow.setFullScreen(false)
  } else {
    mainWindow.setFullScreen(true)
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

const fs = require('fs')
export default {
  getFileType(fileName) {
    return /\.(\w+)$/i.exec(fileName)[1]
  },
  getUrlFromFile(file) {
    return URL.createObjectURL(file)
  },
  getTextFromFile(file) {
    let reader = new FileReader()
    return new Promise((resolve, reject) => {
      try {
        reader.readAsText(file)
      } catch (error) {
        reject(error)
      }
      reader.onload = (e) => {
        resolve(e.target.result)
      }
    })
  },
  checkFileIsExisted(path) {
    try{
      fs.accessSync(path, fs.F_OK);
    }catch(e){
      return false;
    }
    return true;
  }
}

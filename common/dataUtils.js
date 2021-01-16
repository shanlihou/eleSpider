var {globalData} = require('./globalData.js')

function loadUrl(url) {
    if (globalData['mainTimerId']) {
        clearInterval(globalData['mainTimerId']);
        globalData['mainTimerId'] = 0;
    }

    if (url == "index.html") {
        globalData.mainWindow.loadFile(url);
    }
    else {
        console.log('load', url);
        globalData.mainWindow.loadURL(url);
    }
}


module.exports = {
    loadUrl
};
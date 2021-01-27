var {globalData} = require('./globalData.js')

function loadUrl(url) {
    if (globalData['mainTimerId']) {
        clearInterval(globalData['mainTimerId']);
        globalData['mainTimerId'] = 0;
    }

    globalData['curUrl'] = url;

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
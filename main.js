// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const {CONST} = require('./common/const.js')
var {globalData} = require('./common/globalData.js')
const dataUtils = require('./common/dataUtils.js');
const utils = require('./common/utils.js');
var RPC = require('./outer/RpcFunction.js');
const fs = require('fs')
const path = require('path')


const G_CONFIG = require('./' + CONST.spiderContent + '/' + CONST.spiderDir + '/config');


const LISTEN_LIST = [
    'did-stop-loading',
    'did-navigate',
    'did-navigate-in-page',
    'did-frame-finish-load',
    'did-start-loading',
    'did-get-redirect-request',
    'did-get-response-details',
    'new-window',
    'found-in-page',
];
let G_ID_INDEX = 1;
globalData['mainTimerId'] = 0;
globalData['jpgCache'] = {}
function createWindow() {
    console.log('will create window');
    console.log('global:', globalData)
    mainWindow = new BrowserWindow({
        width: 10,
        height: 10,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'inner', 'preload.js')
        }
    })
    globalData['mainWindow'] = mainWindow;
    mainWindow.webContents.openDevTools();
    dataUtils.loadUrl(G_CONFIG.main_url);

    mainWindow.webContents.executeJavaScript('console.log("before")');
    mainWindow.on('closed', function () {
        console.log('closed')
        mainWindow = null
    })
    for (let index in LISTEN_LIST) {
        let eventStr = LISTEN_LIST[index]
        mainWindow.webContents.on(eventStr, () => {
            console.log(eventStr);
        })
    }

    mainWindow.webContents.on('did-finish-load', () => {
        console.log('did-finish-load', mainWindow.webContents.getURL());
        _addScript();

        let timeCount = 0;
        globalData['mainTimerId'] = setInterval(() => {
            timeCount++;
            if (timeCount > CONST.timeOut) {
                console.log('time out')
            }
        }, 1000);
    })
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        let saveInfo = globalData.jpgCache[item.getURL()];
        if (!saveInfo) {
            return;
        }
        console.log('will-down', item.getURL(), saveInfo, globalData.jpgCache)
        let pathName = path.dirname(saveInfo.saveName);
        utils.mkdir(pathName);
        item.setSavePath(saveInfo.saveName);
        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
                item.resume();
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    // console.log(`Received bytes: ${item.getReceivedBytes()}`)
                }
            }
        })
        item.once('done', (event, state) => {
            if (state === 'completed') {
                if (saveInfo.func) {
                    saveInfo.func();
                    delete globalData.jpgCache[item.getURL()];
                }
            } else {
                console.log(`Download failed: ${state}`)
                if (saveInfo.func) {
                    saveInfo.func();
                    delete globalData.jpgCache[item.getURL()];
                }
            }
        })
    })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
    console.log('window-all-closed');
    if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function () {
    console.log('activate')
    if (globalData.mainWindow === null) createWindow()
})

function _addScript() {
    if (globalData['mainTimerId']) {
        clearInterval(globalData['mainTimerId']);
        globalData['mainTimerId'] = 0;
    }
    let wholeData = "G_ID_INDEX = " + G_ID_INDEX + ";\n";
    G_ID_INDEX = (G_ID_INDEX + 1) % 100;
    let jsList = _getJsList(globalData.mainWindow.webContents.getURL());
    console.log('add js:', jsList)
    function* _makeUrlIter() {
        yield path.join('inner', 'innerUtils.js');
        for (url of jsList) {
            yield path.join(CONST.spiderContent, CONST.spiderDir, url);
        }
    }
    let urlIter = _makeUrlIter();

    function _loadAllJs(err, data) {
        wholeData += data;
        let _js = urlIter.next();
        if (!_js.done) {
            let filename = _js.value;
            fs.readFile(filename, 'utf8', _loadAllJs);
        }
        else {
            globalData.mainWindow.webContents.executeJavaScript(wholeData);
        }
    };
    _loadAllJs(null, '');
}

function _getJsList(url) {
    let retList = [];
    for (let patObj of G_CONFIG.content_scripts) {
        for (let pat of patObj.matches) {
            let ret = url.search(pat);
            if (ret != -1) {
                retList = retList.concat(patObj.js);
                break;
            }
        }
    }
    return retList;
}

ipcMain.on('ren2main', (event, arg) => {
    let cmd = arg.cmd;
    if (cmd == 'rpc') {
        let funcName = arg.func;
        let callfunc = eval('RPC.rpc_' + funcName);
        let args = [arg.rpcId].concat(arg.args);
        callfunc.apply(null, args);
    }
    RPC.sendRpcRet(event);
})
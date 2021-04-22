var utils = require("../common/utils.js");
var dataUtils = require("../common/dataUtils.js");
const fs = require('fs');
var {globalData} = require('../common/globalData.js')


var G_GLOBAL_DATA = {};
var G_RPC_RET_LIST = [];


function onRpcRet(rpcId, args) {
    G_RPC_RET_LIST.push({
        rpcId: rpcId,
        args: args,
    })
}

function sendRpcRet(event) {
    let sendObj = G_RPC_RET_LIST.shift();
    if (sendObj) {
        event.sender.send('main2ren', {
            cmd: 'rpcret',
            rpcId: sendObj.rpcId,
            args: sendObj.args,
        });
    }
}

function rpc_test(rpcId, arg, arg2) {
    console.log('im in test', rpcId, arg, arg2);
    onRpcRet(rpcId, [1, 9, 78]);
}

function rpc_loadWithUrl(rpcId, url) {
    onRpcRet(rpcId, []);

    if (url == null) {
        return;
    }
    dataUtils.loadUrl(url);
}

function rpc_setGlobalData(rpcId, key, value) {
    G_GLOBAL_DATA[key] = value;
    onRpcRet(rpcId, []);
}

function rpc_getGlobalData(rpcId, key) {
    let value = G_GLOBAL_DATA[key];
    onRpcRet(rpcId, [value]);
}

function rpc_getFileList(rpcId, dirPath) {
    try {
        let ret = fs.readdirSync(dirPath);
        onRpcRet(rpcId, [ret]);
    }
    catch (Err) {
        onRpcRet(rpcId, [[]]);
    }
}

function rpc_rename(rpcId, srcPath, dstPath) {
    console.log('rename:', srcPath, dstPath)
    utils.mkdir(path.dirname(dstPath));
    fs.renameSync(srcPath, dstPath);
    console.log('rename end:', srcPath, dstPath)
    onRpcRet(rpcId, []);
}

function rpc_logMain(rpcId, args) {
    console.log('logMain:', args)
    onRpcRet(rpcId, [])
}

function rpc_downloadOne(rpcId, url, saveName) {
    let func = () => {
        onRpcRet(rpcId, [true]);
    }
    console.log('down one:', url, saveName);
    //saveName = path.join(__dirname, saveName);
    if (fs.existsSync(saveName)) {
        if (func) {
            func();
        }
        return;
    }

    globalData.jpgCache[url] = {
        saveName: saveName,
        func: func
    };
    mainWindow.webContents.downloadURL(url);
}

module.exports = {
    rpc_test,
    rpc_loadWithUrl,
    rpc_setGlobalData,
    rpc_getGlobalData,
    rpc_getFileList,
    rpc_rename,
    rpc_logMain,
    rpc_downloadOne,
    sendRpcRet
};
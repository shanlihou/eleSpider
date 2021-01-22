const fs = require('fs')
const path = require('path')

function mkdir(pathname) {
    //console.log(pathname);
    if (fs.existsSync(pathname)) {
        return;
    }

    let parent = path.dirname(pathname);
    if (!fs.existsSync(parent)) {
        console.log('mkdir parent', parent);
        mkdir(parent);
    }
    fs.mkdirSync(pathname);
}

function getDownloadDir(app) {
    let appPath = app.getAppPath();
    return appPath + '\\output\\download';
}


module.exports = {
    mkdir,
    getDownloadDir,
};
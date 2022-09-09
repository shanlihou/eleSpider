console.log('demo')
rpc.test("demo").then(function(){
    console.log('demo callback')
});
let BASE = 'https://www.javsee.men/search/'

let RE = /[a-zA-Z]+-\d+/

function getCode(filename) {
    return RE.exec(filename)
}

rpc.getFileList('X:\\github_code\\none').then(function(fileList) {
    console.log('file list:', fileList)
    let codeList = []
    for (idx in fileList) {
        let filename = fileList[idx]
        let _code = getCode(filename)
        if (_code != null){
            console.log(_code[0])
            codeList.push({
                file: filename,
                code: _code[0]
            })
        }
    }

    return rpc.setGlobalData('searchList', codeList)
}).then(function() {
    popGoSearch()
})



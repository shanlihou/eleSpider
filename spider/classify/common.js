
function popGoSearch() {
    rpc.getGlobalData('searchList').then(function(searchList){
        let codeObj = searchList.shift()
        if (codeObj == null) {
            return
        }

        console.log(codeObj)
        rpc.setGlobalData('searchList', searchList).then(function() {
            return rpc.setGlobalData('curCodeObj', codeObj)
        }).then(function() {
            return rpc.loadWithUrl(BASE + codeObj.code);
        })
    })
}


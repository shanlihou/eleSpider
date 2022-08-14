console.log('videoItem')

function getInfo() {
    return rpc.clearMainTimer()
}
getInfo().then(function() {
    let _name = getElementByAttr('div', 'class', 'row movie')
        .children[1]
        .lastElementChild
        .firstElementChild
        .firstElementChild
        .innerHTML
    console.log(_name)

    return rpc.getGlobalData('curCodeObj').then(function(codeObj) {
        console.log(codeObj)
        _newName = '[1][' + _name + '][' + codeObj.code + ']' + codeObj.file
        console.log(_newName)
    })
})

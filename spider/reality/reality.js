console.log('reality')

function getChapters() {
    let list_block = document.querySelector('#list_block');
    let lis = list_block.querySelectorAll('li');
    let pages = [];
    for (let li of lis) {
        let a = li.querySelector('a');
        pages.push({
            url: a.href,
            title: a.innerText,
        })
    }
    console.log(pages)

    let url = window.location.href;
    let dirname = 'download\\' + url.split('/')[4];
    let newPages = [];
    let first = null;
    rpc.getFileList(dirname).then(function(data){
        for (let i of pages) {
            if (data.indexOf(i.title) == -1) {
                newPages.push(i)
            }
        }

        first = newPages.shift();
        return rpc.setGlobalData('curPage', first.title);
    }).then(function(){
        return rpc.setGlobalData('pages', newPages)
    }).then(function(){
        return rpc.loadWithUrl(first.url);
    });
}
getChapters()
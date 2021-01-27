console.log('reality')

function goNext() {
    let first = null;
    rpc.getGlobalData('comic_urls').then((comic_urls)=>{
        first = comic_urls.shift();
        return rpc.setGlobalData('comic_urls', comic_urls)
    }).then(()=>{
        return rpc.loadWithUrl(first);
    })
}

function loadPage(title, pages, url) {
    return rpc.setGlobalData('curPage', title).then(()=>{
        return rpc.setGlobalData('pages', pages)
    }).then(()=>{
        return rpc.loadWithUrl(url);
    });
}


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
    let dirname = 'output\\download\\' + url.split('/')[4];
    let newPages = [];
    let first = null;
    rpc.getFileList(dirname).then(function(data){
        console.log(data);
        for (let i of pages) {
            if (data.indexOf(i.title) == -1) {
                newPages.push(i)
            }
        }

        first = newPages.shift();
        if (first == null) {
            goNext();
        }
        else {
            loadPage(first.title, newPages, first.url);
        }
    });
}
getChapters()
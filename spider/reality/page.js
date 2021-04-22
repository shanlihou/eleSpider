console.log('page')

function nextPage() {
    let div = document.querySelector('#action');
    let lis = div.querySelectorAll("mip-link");
    console.log('go next page', lis[2])
    let nextUrl = lis[2].getAttribute('href');
    rpc.loadWithUrl(nextUrl).then(()=>{
        console.log('go next page', nextUrl)
    })
}

function nextComic() {
    let first = null;
    rpc.getGlobalData('comic_urls').then((comic_urls)=>{
        first = comic_urls.shift();
        return rpc.setGlobalData('comic_urls', comic_urls)
    }).then(()=>{
        return rpc.loadWithUrl(first);
    })
}

function nextChapter() {
    let nextPageInfo = null;
    rpc.getGlobalData('pages').then((pages)=>{
        if (pages.length == 0) {
            nextComic();
            return
        }

        nextPageInfo = pages.shift();
        if (nextPageInfo == null) {
            nextComic();
            return;
        }
        return rpc.setGlobalData('pages', pages)
    }).then(()=>{
        return rpc.loadWithUrl(nextPageInfo.url)
    }).then(()=>{});
}

function getDir() {
    let url = window.location.href;
    return url.split('/')[4];
}

function downJpg() {
    let mip_img = document.querySelector('#chapter-image');
    if (mip_img == null) {
        rpc.loadWithUrl(window.location.href).then(()=>{console.log('go self again')});
        return;
    }
    console.log('img:', mip_img)
    let img = mip_img.querySelector('img');

    let imgUrl = img.getAttribute('src');

    let p10_title = getElementByAttr('div', 'class', 'p10 title3');
    let title_a = p10_title.querySelector('span');
    let title = title_a.childNodes[1].wholeText.substring(1);

    let cur_span = p10_title.querySelector('#k_page');
    let total_span = p10_title.querySelector('#k_total');

    let dirname = getDir() + '\\' + encodeURI(title) + "\\" + cur_span.innerHTML + ".jpg"
    rpc.downloadOne(imgUrl, dirname).then((ret)=>{
        if (cur_span.innerHTML == total_span.innerHTML) {
            nextChapter();
        }
        else {
            nextPage();
        }
    })
}
downJpg()

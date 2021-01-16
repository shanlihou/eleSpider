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

function nextChapter() {
    let nextPageInfo = null;
    rpc.getGlobalData('pages').then((pages)=>{
        if (pages.length == 0) {
            console.log('spider end')
            return
        }

        nextPageInfo = pages.shift();
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
    let mip_img = document.querySelector('mip-img');
    if (mip_img == null) {
        rpc.loadWithUrl(window.location.href).then(()=>{console.log('go self again')});
        return;
    }

    let imgUrl = mip_img.getAttribute('src');
    let p10_title = getElementByAttr('div', 'class', 'p10 title3');
    let title_a = p10_title.querySelector('span');
    let title = title_a.childNodes[1].wholeText.substring(1);
    let cur_span = p10_title.querySelector('#k_page');
    let total_span = p10_title.querySelector('#k_total');

    let dirname = 'output\\download\\' + getDir() + '\\' + title + "\\" + cur_span.innerHTML + ".jpg"
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
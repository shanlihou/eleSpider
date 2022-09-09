console.log('main')
main_urls = [
    // "http://m.90mh.com/manhua/yijinanONEyuanzuoban/",
    // "http://m.90mh.com/manhua/DrSTONEshijiyuan/",
    // "http://m.90mh.com/manhua/gelaipunier/",
    // "http://m.90mh.com/manhua/guanyuwozhuanshenghouchengweishilaimudenajianshi/",
    // "http://m.90mh.com/manhua/zaiyishijiemigongkaihougong/",
    // "http://m.90mh.com/manhua/zhongmodehougong/",
    // "http://m.90mh.com/manhua/wodexianshishilianaiyouxi/",
    // "http://m.90mh.com/manhua/duziyirendeyishijiegonglue/",
    "http://m.90mh.com/manhua/GIGANT/",
]

let first = main_urls.shift();

rpc.setGlobalData('comic_urls', main_urls).then(()=>{
    return rpc.loadWithUrl(first);
});
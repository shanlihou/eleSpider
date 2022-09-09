# 简单爬虫框架搭建

## 0x01：目录结构
项目是基于electron的，electron应用分为主进程，和渲染进程，渲染进程主要用来做ui呈现，主进程可以做一些与主机相关的操作，比如文件读取等等，并且主进程是常驻的，渲染进程会随着页面切换而销毁重建，而这两个进程相互通信只能通过rpc调用  
而我们的爬虫脚本就是运行在渲染进程中，或者可以理解为运行在webview里面，之所以运行在渲染进程中是为了方便对网页元素操作。  
下面介绍下目录结构，我会用<font color=red>红色</font>标注出来如果仅仅是用的话需要修改哪些，通常都是和渲染进程相关。  

![dir_struct](https://attach.52pojie.cn/forum/202101/16/230413o9xcxpxspsehxccr.png)

如上图
common：此目录用于存放一些主进程常用的接口，属于框架部分  
inner：此目录存放一些渲染进程常用接口，属于框架部分，也属于渲染进程，一般不需要改  
outer：此目录用于存放和主进程中需要和渲染进程通信的一些rpc调用，属于主进程，用户觉得功能不够可以往里面添加。  
output：用来存放爬虫爬下来的内容，默认为空  
<font color=red>spider：此目录用来存放爬虫脚本</font>  

一些根目录下文件介绍：
main.js：主进程的脚本
index.html：用作临时渲染页面，无主爬虫页面时候使用

## 0x02: 使用
拿我自己写的爬虫reality举例
如果想要直接写爬虫，不想了解框架的话，首先在spider目录下新建自己的爬虫目录，比如reality。

![reality](https://attach.52pojie.cn/forum/202101/16/232555z7sj4k9s9skksgz8.png)

然后修改common/const.js文件的spiderDir为刚才新建的爬虫目录名：reality，这样项目启动的时候就会以当前爬虫启动

```js
CONST = {
    spiderContent: 'spider',
    spiderDir: 'reality',
    timeOut: 30
}

module.exports = {
    CONST
}
```

再回到爬虫目录看里面有个文件config.js内容如下，熟悉chrome插件开发的朋友可能会发现很像manifest.json文件。  
main_url代表的是爬虫第一个要进入的页面。  
content_scripts.matches 和content_scripts.js代表了对于某个页面当这个页面url匹配了matches里面的正则时候，就会自动为你加载js里面的js文件了，可以写多个  
比如下面的主页就会匹配reality.js  


```js
main_url = "index.html";
content_scripts = [
    {
        matches: [/index.html/],
        js:["main.js"]
    },
    {
        matches: [/http:\/\/m\.90mh\.com\/manhua\/\w+\/$/,],
        js:["reality.js"]
    },
    {
        matches: [/http:\/\/m\.90mh\.com\/manhua\/\w+\/\d+/,],
        js:["page.js"]
    }
]

module.exports = {
    main_url: main_url,
    content_scripts: content_scripts,
}
```

下面就以page.js为例说下爬虫的能用到的api
通用的js语法我就不说了

```js
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
        return rpc.setGlobalData('pages', pages) // 设置全局缓存值，这个值会在运行时永久存在内存中，除非项目停止或用户自行删除
    }).then(()=>{
        return rpc.loadWithUrl(nextPageInfo.url) // 主要用来切换页面使用
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
    rpc.downloadOne(imgUrl, dirname).then((ret)=>{ // 用来下载图片第一个参数是图片url地址，第二个参数存储目录。
        if (cur_span.innerHTML == total_span.innerHTML) {
            nextChapter();
        }
        else {
            nextPage();
        }
    })
}
downJpg()
```

如上,框架内的api都用注释标出来了,因为是rpc调用,所有的操作都是异步进行的,所以then后面的内容不会在当前函数结束前调用.  
有了如上这些功能，一些爬虫所需的简单操作就都具备了，下面介绍下接口不够用了怎么办

## 0x03: 增加API

有些同学可能觉得目前提供的api不够自己用.  
如果想添加新的rpc调用，可以通过在outer/RpcFunction.js中添加前缀为“rpc_”的函数名.  
这样前缀后面的内容就能以api的形式被渲染进程调用.  
如下面代码中downloadOne这个rpc在outer/RpcFunction.js中是这个样子的,rpcId是当前rpc调用的独有标识，用来在给渲染进程返回值时候使用。  
后面的URL，和saveName就是之前rpc调用的两个参数了.  
大家可以看到下面代码中有一个onRpcRet的调用，这个调用是用来给渲染进程返回参数的，一定要记得调用这个，即使是无返回值，第一个参数就是传进来的rpcId，第二个就是给渲染进程的返回值了。  

```js
function rpc_downloadOne(rpcId, url, saveName) {
    let func = () => {
        onRpcRet(rpcId, [true]);
    }
    if (fs.existsSync(saveName)) {
        if (func) {
            func();
        }
        return;
    }

    globalData.jpgCache = {
        saveName: saveName,
        func: func
    };
    mainWindow.webContents.downloadURL(url);
}
```

## 0x04：内部运行机制

那么说完了怎么使用，下面说下内部是怎么运行的吧.  

### 运行步骤

1#首先读取const.js中刚刚定义的spiderDir 变量，从中读取要运行哪个爬虫目录  
2#然后根据爬虫目录中配置文件config.js中的main_url来读取爬虫的根页面（可以填index.html，当你不知道要首先加载什么页面时候）。  
3#在主进程收到当前页面加载完成的消息后，首先加载inner/innerUtils.js文件（主要放了一下rpc相关的封装）到渲染进程中。  
4#加载完innerUtils之后根据当前页面url来皮牌config.js中的matches，根据匹配来加载js文件到渲染进程中。  
5#渲染进程运行后如果其中有rpc（rpc定义如下）调用，就会通过这个rpc Proxy将内容封装成object通过ipcRenderer.send[color=var(--darkreader-inline-color) ]发送到主进程  

```js
var rpc = new Proxy({}, {
    get: function(obj, prop) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return new Promise(function(resolve, reject){
                let rpcId = generateRpcId();
                G_RPC_CACHE[rpcId] = {
                    retFunc: resolve,
                }
                ipcRenderer.send('ren2main', {
                    cmd: 'rpc',
                    func: prop,
                    args, args,
                    rpcId: rpcId,
                });
            });
        }
    }
});
```
6#主进程（定义如下，在main.js中）收到消息后，会根据“rpc_函数名”找到对应的接口，并调用  

```js
ipcMain.on('ren2main', (event, arg) => {
    let cmd = arg.cmd;
    if (cmd == 'rpc') {
        let funcName = arg.func;
        let callfunc = eval('RPC.rpc_' + funcName);
        let args = [arg.rpcId].concat(arg.args);
        callfunc.apply(null, args);
    }
    RPC.sendRpcRet(event);
})
```

7#在调用完毕后再通过onRpcRet将参数返回给渲染进程  


通过如上流程最终实现的效果就是让渲染进程既具备了访问网页元素的能力，同时具备了与主机交互的能力，有了这些能力，剩下的就交给爬虫来做了。  

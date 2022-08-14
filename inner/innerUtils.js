console.log('inner inject')
const {ipcRenderer} = Myrequire('electron');
G_RPC_CACHE = {}
G_TICK_FUNC = null;
G_TICK_TIMES = 0;

function generateRpcId() {
    for (let id = 0; id < 1000; id ++) {
        let rpcId = G_ID_INDEX * 1000 + id;
        if (!(rpcId in G_RPC_CACHE)){
            return rpcId;
        }
    }
    return null;
}

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

function rpcCall(func, args, retFunc) {
    let rpcId = generateRpcId();
    G_RPC_CACHE[rpcId] = {
        retFunc: retFunc,
    }
    ipcRenderer.send('ren2main', {
        cmd: 'rpc',
        func: func,
        args, args,
        rpcId: rpcId,
    });
}

function getElementByAttr(tag, attr, value){
    var elements = document.getElementsByTagName(tag);
    for (var i = 0; i < elements.length; i++){
        if (elements[i].getAttribute(attr) == value)
        {
            return elements[i];
        }
    }
    return null;
}

function logMain() {
    rpcCall('logMain', arguments, ()=>{
    })
}

ipcRenderer.on('main2ren', (event, arg)=>{
    //console.log(arg, G_RPC_CACHE);
    if (arg.cmd == 'rpcret') {
        let args = arg.args;
        let rpcId = arg.rpcId;
        let rpcCache = G_RPC_CACHE[rpcId];
        if (rpcCache) {
            let callback = rpcCache.retFunc;
            if (callback) {
                callback.apply(null, args);
            }
            delete G_RPC_CACHE[rpcId];
        }
    }
})

setInterval(()=>{
    ipcRenderer.send('ren2main', {
        cmd: 'tick'
    });

    if (G_TICK_FUNC) {
        G_TICK_TIMES ++;
        G_TICK_FUNC(G_TICK_TIMES);
    }
}, 1000);

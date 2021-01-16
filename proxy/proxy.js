
let sm = new StateMach();

sm.add('wait', ()=>{
    console.log('wait');
    let tbss = document.querySelector('#tbss');
    if (tbss) {
        let tbody = tbss.querySelector('tbody');
        if (tbody) {
            return 'do';
        }
    }
    return 'wait';
});

sm.add('do', ()=>{
    let tbss = document.querySelector('#tbss');
    let tbody = tbss.querySelector('tbody');
    let trs = tbody.querySelectorAll('tr');
    let jsonObj = [];
    console.log(trs);
    for (let tr of trs) {
        let tds = tr.querySelectorAll('td');
        let ip = tds[1].innerHTML;
        let port = tds[2].innerHTML;
        let pwd = tds[4].innerHTML;
        let method = tds[3].innerHTML;
        let remark = ip + '-' + tds[6].innerHTML;
        console.log(tds, ip);
        jsonObj.push({
            server: ip,
            server_port: parseInt(port),
            password: pwd,
            method: method,
            remarks: remark,
            timeout: 5
        });
    }
    let jsonStr = JSON.stringify(jsonObj);
    console.log(jsonStr);
    return 'end';
})

setInterval(()=>{
    sm.do();
}, 1000);
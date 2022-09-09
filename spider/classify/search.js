console.log('hello')

function getBox() {
    console.log('will clear timer')
    rpc.clearMainTimer().then(function() {
        let _href = document.querySelector('.movie-box')
                .getAttribute('href')
        console.log(_href)
        rpc.loadWithUrl(_href)
    })
}

getBox()

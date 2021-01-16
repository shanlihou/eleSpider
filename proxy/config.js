main_url = "https://free-ss.co/"
//main_url = "https://github.com/search?q=windbg"
content_scripts = [
    {
        matches: [/free-ss/i,],
        js:["proxy.js"]
    }
]

module.exports = {
    main_url: main_url,
    content_scripts: content_scripts,
}
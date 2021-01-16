// main_url = "https://www.mangabz.com/1362bz/"
main_url = "index.html"
content_scripts = [
    {
        matches: [/index.html/],
        js:["main.js"]
    }
]


module.exports = {
    main_url: main_url,
    content_scripts: content_scripts,
}
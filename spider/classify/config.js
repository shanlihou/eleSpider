// main_url = "https://www.mangabz.com/1362bz/"
// avmoo.click
main_url = "index.html"
content_scripts = [
    {
        matches: [/index.html/],
        js:["common.js", "main.js"]
    },
    {
        matches: [/search/],
        js:["search.js"]
    },
    {
        matches: [/javsee/],
        js:["common.js", "videoItem.js"]
    }
]


module.exports = {
    main_url: main_url,
    content_scripts: content_scripts,
}

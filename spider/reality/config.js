//main_url = "http://m.90mh.com/manhua/DrSTONEshijiyuan/"
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
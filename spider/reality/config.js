// main_url = "https://www.mangabz.com/1362bz/"
main_url = "http://m.90mh.com/manhua/DrSTONEshijiyuan/"
content_scripts = [
    {
        matches: [/http:\/\/m\.90mh\.com\/manhua\/\w+\/$/,],
        js:["reality.js"]
    },
    {
        // matches: [/wodexianshishilianaiyouxi\/\d+/],
        matches: [/http:\/\/m\.90mh\.com\/manhua\/\w+\/\d+/,],
        js:["page.js"]
    }
]

module.exports = {
    main_url: main_url,
    content_scripts: content_scripts,
}
// Takes all of our "bootstrap" files, i.e.
// the preloader, CSS, and HTML, and inlines them
// into a standalone HTML file.

const autoprefixer = require('autoprefixer-core')
const Clean        = require('clean-css')
const cheerio      = require('cheerio')
const path         = require('path')
const fs           = require('fs')

module.exports = inline

const header = {
  html: fs.readFileSync(require.resolve('@nsight/header/header.html'), 'utf8'),
  css: fs.readFileSync(require.resolve('@nsight/header/index.css'), 'utf8')
}

if (!module.parent) console.log(inline())

function inline() {
  var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')
  var $    = cheerio.load(html)

  $('link').each(function(i, node) {
    var href = $(node).attr('href')
    if (!href) return
    if (!href.indexOf('http')) return
    if (!href.indexOf('//')) return

    var css = fs.readFileSync(path.resolve(__dirname, href), 'utf8')

    css = [css, header.css].join('\n')
    css = autoprefixer.process(css, { browsers: ['last 2 versions'] }).css
    css = (new Clean).minify(css).styles

    var style = $('<style type="text/css"></style>')
    style.html(css)
    $('head').append(style)

    $(node).remove()
  })

  $('script').each(function(i, node) {
    var src = $(node).attr('src')
    if (!src) return
    if (src === 'preload.js') src = require.resolve('@unpm/preloader/bundle.js')

    var js = fs.readFileSync(path.resolve(__dirname, src), 'utf8')
    $(node).attr('src', null)
    $(node).html(js)
  })

  $('nsight-header').each(function(i, node) {
    $(header.html).insertBefore(node)
    $(node).remove()
  })

  return $.html()
}

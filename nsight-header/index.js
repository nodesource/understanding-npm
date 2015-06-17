var css    = require('defaultcss')
var domify = require('domify')
var path   = require('path')
var fs     = require('fs')

var style  = fs.readFileSync(path.join(__dirname, 'index.css'), 'utf8')
var markup = fs.readFileSync(path.join(__dirname, 'header.html'), 'utf8')

css('@nsight/header', style)
module.exports = function() {
  return domify(markup)
}

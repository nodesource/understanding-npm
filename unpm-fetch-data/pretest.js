const path = require('path')
const fs   = require('fs')

const data = path.dirname(require.resolve('@unpm/dat/data/downloads.bin'))

try {
  fs.mkdirSync(path.join(__dirname, 'fixtures'))
} catch(e) {}

;['downloads.bin'
, 'licenses.bin'
, 'licenses.json'
, 'names.json'
].forEach(function(name) {
  fs.createReadStream(path.join(data, name))
    .pipe(fs.createWriteStream(path.join(__dirname, 'fixtures', name)))
})

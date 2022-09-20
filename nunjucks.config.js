var fs = require('fs');
var path = require('path');

module.exports = {
  ext: '.jinja',
  searchPaths: ['./src/views'],
  json: function (fileName) {
    return JSON.parse(fs.readFileSync('./data/' + fileName + '.json'))
  }
};

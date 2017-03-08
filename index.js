var path = require('path');
var each = require('async-each');
var PDF = require('nodepdf-series');
var os = require('os');

module.exports = function (opts) {
  opts = opts || {};
  var concurrent = opts.concurrent || os.cpus().length;

  return function phantomPDF (files, metalsmith, done) {
    var filenames = Object.keys(files).map(function (filename) {
      // only convert .html files
      if (filename.search(/\.html$/i) === -1) {
        return false;
      }
      filename = path.resolve(path.join(metalsmith.source(), filename));
      return 'file://' + filename;
    }).filter(function(item) { return item });

    var chunks = chunk(filenames, concurrent);
    each(chunks, function (chunk, cb) {
      PDF(chunk, cb);
    }, done);
  }
}

function chunk (arr, num) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return [];
  }
  if (isNaN(num) || num < 1) {
    return [arr];
  }
  var chunks = [];
  var i;
  for (i = 0; i < num; i++) {
    chunks.push([]);
  }
  for (i = 0; i < arr.length; i++) {
    chunks[i % num].push(arr[i]);
  }
  return chunks;
}

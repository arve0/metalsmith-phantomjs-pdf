# metalsmith-phantomjs-pdf

Converts HTML files from local filesystem to PDF with [phantomjs](http://phantomjs.org).

To use this package you do **not** need to install phantomjs, [phantomjs-prebuilt](https://www.npmjs.com/package/phantomjs-prebuilt) is installed for you.

## Usage

```js
var Metalsmith = require('metalsmith')
var changed = require('metalsmith-changed')
var pdf = require('metalsmith-phantomjs-pdf')
var fs = require('fs');
var path = require('path');

var ctimes = 'metalsmith-changed-ctimes-html.json';


// do the building
Metalsmith('.')
  .source('build')  // output-folder for another build, for example md -> html
  .clean(false) // do not delete any files
  .use(changed({ ctimes: ctimes }))
  .use(deleteOldPDF)
  .use(pdf())
  .use(onlyCtimes)
  .destination('build')
  .build(function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('done');
    }
  });

/**
 * Delete old PDF files (not depending on phantomjs overwriting)
 */
function deleteOldPDF (files, metalsmith, done) {
  Object.keys(files).forEach(function (file) {
    if (file !== ctimes) {
      var oldPDF = path.join(metalsmith.source(),
                             file.replace(/\.html$/i, '.pdf'));
      try {
        fs.unlinkSync(oldPDF);
      } catch (err) {
        console.error('Unable to remove PDF: ' + oldPDF);
        console.error(err);
      }
    }
  });
  done();
}

/**
 * Remove HTML-files from build, such that they are not overwritten,
 * as we are only reading them to get file URLs
 */
function onlyCtimes (files, _, done) {
  Object.keys(files).forEach(function (file) {
    if (file !== ctimes) {
      delete files[file];
    }
  });
  done();
}
```

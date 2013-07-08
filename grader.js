#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command-line application development and
basic DOM parsing.

References:
+ cheerio
 - https://github.com/MatthewMueller/cheerio (HTML parsing via jQuery core.)
 - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
 - http://maxogden.com/scraping-with-node.html
+ commander.js
 - https://github.com/visionmedia/commander.js
 - http://tjholowaychuk.com/post/9103188408/
   commander-js-nodejs-command-line-interfaces-made-easy
+ JSON
 - http://en.wikipedia.org/wiki/JSON
 - https://developer.mozilla.org/en-US/docs/JSON
 - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
  
function loadChecks(checksfile) {
  return JSON.parse(fs.readFileSync(checksfile));
}

// I'VE CHANGED THIS TO TAKE A STRING OF HTML, RATHER THAN A FILE NAME.
function checkHtmlFile(htmlfile, checksfile) {
  $ = cheerio.load(htmlfile);
  var checks = loadChecks(checksfile).sort();
  var out = {};
  for (var i in checks) {
    var present = $(checks[i]).length > 0;
    out[checks[i]] = present;
  }
  return out;
}

if (require.main == module) {
  program
    .option('-c, --checks <file>', 'Path to checks.json', CHECKSFILE_DEFAULT) 
    .option('-f, --file <file>', 'Path to index.html', HTMLFILE_DEFAULT)
    .option('-u, --url <url>', 'URL of HTML page')
    .parse(process.argv);
  if (program.url) {
    var rest = require('restler');
    rest.get(program.url).on('complete', function(d,r) {
      var checkJson = checkHtmlFile(r.raw.toString(), program.checks);
      var outJson = JSON.stringify(checkJson, null, 4);
      console.log(outJson);
    });
  }
  else {
    var html = fs.readFileSync(program.file);
    var checkJson = checkHtmlFile(html, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
  }
}
else {
  exports.checkHtmlFile = checkHtmlFile;
}

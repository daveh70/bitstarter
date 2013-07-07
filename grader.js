#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command-line application development and
basic DOM parsing.

References:
+ cheerio
 - https://github.com/MatthewMueller/cheerio
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

function assertFileExists(infile) {
  var instr = infile.toString();
  if (!fs.existsSync(instr)) {
    console.log("%s does not exist. Exiting.", instr);
    process.exit(1);
  }
  return instr;
}

function cheerioHtmlFile(htmlfile) {
  return cheerio.load(fs.readFileSync(htmlfile));
}

function loadChecks(checksfile) {
  return JSON.parse(fs.readFileSync(checksfile));
}

function checkHtmlFile(htmlfile, checksfile) {
  $ = cheerioHtmlFile(htmlfile);
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
    .option('-c, --checks ', 'Path to checks.json', assertFileExists,
            CHECKSFILE_DEFAULT)
    .option('-f, --file ', 'Path to index.html', assertFileExists,
            HTMLFILE_DEFAULT)
    .parse(process.argv);
  var checkJson = checkHtmlFile(program.file, program.checks);
  var outJson = JSON.stringify(checkJson, null, 4);
  console.log(outJson);
}
else {
  exports.checkHtmlFile = checkHtmlFile;
}


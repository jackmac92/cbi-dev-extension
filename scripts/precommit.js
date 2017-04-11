#! /usr/bin/env node
const path = require('path');
const git = require('simple-git')(path.join(__dirname, '../'));
const diffParser = require('parse-diff');
const echo = console.log;

git.diff((err, diffText) => {
  const files = diffParser(diffText);
  files.forEach(f => {
    f.chunks.forEach(c => {
      echo(c.changes);
    });
    echo('\n\n');
  });
});
// process.exit(0);


// var diff = ''; // input diff string
// var files = parse(diff);
// console.log(files.length); // number of patched files
// files.forEach(function(file) {
//     console.log(file.chunks.length); // number of hunks
//     console.log(file.chunks[0].changes.length) // hunk added/deleted/context lines
//     // each item in changes is a string
//     console.log(file.deletions); // number of deletions in the patch
//     console.log(file.additions); // number of additions in the patch
// });

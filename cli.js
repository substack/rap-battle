#!/usr/bin/env node

var spawn = require('child_process').spawn;
var cmd = process.argv[2];
if ([ 'rap', 'server', 'watch' ].indexOf(cmd) < 0) {
    console.error('Usage: rap-battle { rap | server | watch }');
    process.exit();
}

spawn(
    'node',
    [ __dirname + '/' + process.argv[2] + '.js' ]
        .concat(process.argv.slice(3))
);

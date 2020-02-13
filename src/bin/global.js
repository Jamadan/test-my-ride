#!/usr/bin/env node

// Delete the 0 and 1 argument (node and script.js)
var args = process.argv.splice(process.execArgv.length + 2);
var path = require('path');
console.log(args);
var fileName = args[0];

var testMyRide = require('../index');

testMyRide(path.join(process.cwd() + '/' + fileName));

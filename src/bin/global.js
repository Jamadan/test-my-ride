#!/usr/bin/env node

// Delete the 0 and 1 argument (node and script.js)
var args = process.argv.splice(process.execArgv.length + 2);

console.log(args);
var fileName = args[0];
var fnName = args[1];
var configFileName = args[2];

var testMyRide = require('../index');

testMyRide(fileName, fnName, configFileName);

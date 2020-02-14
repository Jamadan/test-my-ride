#!/usr/bin/env node

// Delete the 0 and 1 argument (node and script.js)
var args = process.argv.splice(process.execArgv.length + 2);

console.log(args);
var fileName = args[0];

var functionNameExists = args.find(a => a === '--function');
var fnName = functionNameExists
  ? args[args.indexOf(args.find(a => a === '--function')) + 1]
  : undefined;

var configFileExists = args.find(a => a === '--config');
var configFileName = configFileExists
  ? args[args.indexOf(args.find(a => a === '--config')) + 1]
  : undefined;

var testMyRide = require('../index');

testMyRide(fileName, fnName, configFileName);

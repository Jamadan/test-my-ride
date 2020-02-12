import * as esprima from 'esprima';
const readEachLineSync = require('read-each-line-sync');

import * as babel from '@babel/parser';
import traverse from '@babel/traverse';
const read = require('read-file');

// import isNumberSub, { isStringSub } from '../test/sub-func';
import * as importedFuncs from '../test/index';

export default () => {
  const filename = __dirname + '/../test/index.js';

  const file = read.sync(filename, { encoding: 'utf8' });
  // console.log(file);

  const parsed = babel.parse(file, { sourceType: 'module' });
  // console.log(parsed);

  const exportedFns = parsed.program.body.filter(
    node => node.type === 'ExportNamedDeclaration'
  );
  const defaultFn = parsed.program.body.filter(
    node => node.type === 'ExportDefaultDeclaration'
  );

  const importedFns = parsed.program.body.filter(
    node => node.type === 'ImportDeclaration'
  );

  // TODO: traverse AST, within exported functions, find all calls to imported members
  // Return something like { [fnName]: [importA, importB, blah...] }

  const usedImports = {}; // traverse(parsed, {
  // ExportNamedDeclaration: path => {
  //   traverse(path.no)
  // }
  // });
  console.log(usedImports);

  // TODO: write output test file.

  return importedFns;
};

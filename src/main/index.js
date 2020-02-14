import path from 'path';
import * as read from 'read-file';
import fs from 'fs';
import getFns from './get-fns';
import prettier from 'prettier/standalone';
import prettierBabylon from 'prettier/parser-babylon';

import {
  createImportStatements,
  createMockFileStatements,
  createAssignMockStatements,
  createDefaultDescribe,
  createSubjectUnderTestStatement,
  createNamedDescribes
} from './create-statements';

export default (filename, fnName, pathToJsonConfig, forceSave) => {
  const filenameParts = filename.split('.');
  const ext = filenameParts.pop();
  const fullFileName = path.join(process.cwd() + '/' + filename);
  let config = {
    prettier: {
      parser: 'babel',
      plugins: [prettierBabylon],
      semi: true,
      singleQuote: true
    }
  };
  if (pathToJsonConfig) {
    const jsonConfig = require(path.join(
      process.cwd() + '/' + pathToJsonConfig
    ));

    config = {
      ...jsonConfig,
      prettier: {
        ...jsonConfig.prettier,
        ...{
          parser: 'babel',
          plugins: [prettierBabylon]
        }
      }
    };
  }
  const saveFilename = path.join(
    process.cwd() +
      '/' +
      filenameParts.join('.') +
      (config.outputPostfix || '.test-my-ride') +
      '.' +
      ext
  );
  if (!fs.existsSync(fullFileName)) {
    // filename not found
    console.error('filename not found');
    return;
  }
  if (!forceSave && fs.existsSync(saveFilename)) {
    // test file already found
    console.error(
      'test filename already exists. please use --force if you want to overwrite it'
    );
    return;
  }

  const file = read.sync(fullFileName, {
    encoding: 'utf8'
  });
  // console.log(file);

  const fns = getFns(file, fnName);
  //console.log(fns);

  const importFiles = [...new Set(fns.importedFns.map(fn => fn.location))];
  const importStatements = createImportStatements(importFiles);
  const mockStatements = createMockFileStatements(importFiles);

  const assignMocksStatements = createAssignMockStatements(importFiles, fns);
  const defaultDescribe = createDefaultDescribe(fns);
  const nameDescribes = createNamedDescribes(fns);

  const sutStatement = createSubjectUnderTestStatement(filename);

  const outputTestFileString = `import { mockFile, mockFunction } from 'mock-my-ride';

  ${importStatements}
  ${mockStatements}
  ${assignMocksStatements}

  ${sutStatement}

  ${defaultDescribe}
  
  ${nameDescribes}`;

  fs.writeFileSync(
    saveFilename,
    prettier.format(outputTestFileString, config.prettier)
  );
};

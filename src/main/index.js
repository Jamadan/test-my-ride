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

export default (filename, pathToJsonConfig) => {
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
  const file = read.sync(path.join(process.cwd() + '/' + filename), {
    encoding: 'utf8'
  });
  // console.log(file);

  const fns = getFns(file);
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

  const filenameParts = filename.split('.');
  const ext = filenameParts.pop();
  fs.writeFileSync(
    path.join(
      process.cwd() +
        '/' +
        filenameParts.join('.') +
        (config.outputPostfix || '.test-my-ride') +
        '.' +
        ext
    ),
    prettier.format(outputTestFileString, config.prettier)
  );
};

import path from 'path';
import * as read from 'read-file';
import fs from 'fs';
import getFns from './get-fns';
import prettier from 'prettier/standalone';
import defaultConfig from '../config';

import createOutputString from './create-statements';

export default (filenameToTest, fnName, pathToJsonConfig, forceSave) => {
  const filenameParts = filenameToTest.split('.');
  const ext = filenameParts.pop();
  const fullFileName = path.join(process.cwd() + '/' + filenameToTest);

  let config = {
    prettier: defaultConfig.prettier
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
          parser: defaultConfig.prettier.parser,
          plugins: defaultConfig.prettier.plugins
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

  const outputString = config.createOutputString
    ? config.createOutputString(fns, filenameToTest)
    : createOutputString(fns, filenameToTest);

  fs.writeFileSync(
    saveFilename,
    prettier.format(outputString, config.prettier)
  );
};

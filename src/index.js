import * as read from 'read-file';
import fs from 'fs';
import getFns from './get-fns';
import {
  createImportStatements,
  createMockFileStatements,
  createAssignMockStatements,
  createDescribes,
  createSubjectUnderTestStatement
} from './create-statements';

export default filename => {
  const file = read.sync(__dirname + '/' + filename, { encoding: 'utf8' });
  // console.log(file);

  const fns = getFns(file);
  //console.log(fns);

  const importFiles = [...new Set(fns.importedFns.map(fn => fn.location))];
  const importStatements = createImportStatements(importFiles);
  const mockStatements = createMockFileStatements(importFiles);

  const assignMocksStatements = createAssignMockStatements(importFiles, fns);
  const describes = createDescribes(fns);

  const sutStatement = createSubjectUnderTestStatement(filename);

  const outputTestFileString = `import { mockFile, mockFunction } from 'mock-my-ride';

${importStatements}
${mockStatements}
${assignMocksStatements}

${sutStatement}

${describes}
`;

  const filenameParts = filename.split('.');
  const ext = filenameParts.pop();
  fs.writeFileSync(
    __dirname + '/' + filenameParts.join('.') + '.test-my-ride.' + ext,
    outputTestFileString
  );
};

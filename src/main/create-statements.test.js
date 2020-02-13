import path from 'path';
import * as read from 'read-file';
import getFns from './get-fns';

import * as subjectUnderTest from './create-statements.js';

const testFile = read.sync(path.join(process.cwd() + '/test/index.js'), {
  encoding: 'utf8'
});

const fns = getFns(testFile);
const importFiles = [...new Set(fns.importedFns.map(fn => fn.location))];

describe('createImportStatements', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createImportStatements(importFiles)).toEqual(
      `import * as importFns1 from './sub-func';`
    );
  });
});

describe('createMockFileStatements', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createMockFileStatements(importFiles)).toEqual(
      'mockFile(importFns1);'
    );
  });
});

describe('createAssignMockStatements', () => {
  it('returns correct string', () => {
    expect(
      subjectUnderTest.createAssignMockStatements(importFiles, fns)
    ).toEqual(
      `const isNumberSub = importFns1.default;const { isStringSub } = importFns1;`
    );
  });
});

describe('createDefaultDescribes', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createDefaultDescribe(fns)).toEqual(
      `describe('defaultExport', () => {it('returns true when isNumberSub is true', () => {mockFunction(isNumberSub, true);expect(subjectUnderTest.default()).toEqual(true);});});`
    );
  });
});

describe('createNamedDescribes', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createNamedDescribes(fns)).toEqual(
      `describe('increment', () => {it('returns true when  is true', () => {expect(subjectUnderTest.increment()).toEqual(true);});});
describe('isString', () => {it('returns true when isStringSub is true', () => {mockFunction(isStringSub, true);expect(subjectUnderTest.isString()).toEqual(true);});});`
    );
  });
});

describe('createIt', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createIt('jam', ['sub1', 'sub2'])).toEqual(
      `it('returns true when sub1, sub2 is true', () => {mockFunction(sub1, true);mockFunction(sub2, true);expect(subjectUnderTest.jam()).toEqual(true);});`
    );
  });
});

describe('createSubjectUnderTestStatement', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createSubjectUnderTestStatement('jam')).toEqual(
      "import * as subjectUnderTest from './jam';"
    );
  });
});

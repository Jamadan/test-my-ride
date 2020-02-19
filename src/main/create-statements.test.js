import path from 'path';
import * as read from 'read-file';
import getFns from './get-fns';

import * as subjectUnderTest from './create-statements.js';

const testFile = read.sync(path.join(process.cwd() + '/test/index.js'), {
  encoding: 'utf8'
});

const fns = getFns(testFile);

describe('createImportStatements', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createImportStatements(fns)).toEqual(
      `import isNumberSub, { isStringSub } from './sub-func';`
    );
  });
});

describe('createMockFileStatements', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createMockFileStatements(fns)).toEqual(
      `mockFunctions(require('./sub-func'));`
    );
  });
});

describe('createDefaultDescribes', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createDefaultDescribe(fns)).toEqual(
      `describe('defaultExport', () => {it('returns true when isNumberSub is true', () => {setMockValue(isNumberSub, true);expect(subjectUnderTest.default()).toEqual(true);});});`
    );
  });
});

describe('createNamedDescribes', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createNamedDescribes(fns)).toEqual(
      `describe('one', () => {it('returns true when  is true', () => {expect(subjectUnderTest.one()).toEqual(true);});});describe('increment', () => {it('returns true when  is true', () => {expect(subjectUnderTest.increment()).toEqual(true);});});describe('isString', () => {it('returns true when isStringSub is true', () => {setMockValue(isStringSub, true);expect(subjectUnderTest.isString()).toEqual(true);});});`
    );
  });
});

describe('createIt', () => {
  it('returns correct string', () => {
    expect(subjectUnderTest.createIt('jam', ['sub1', 'sub2'])).toEqual(
      `it('returns true when sub1, sub2 is true', () => {setMockValue(sub1, true);setMockValue(sub2, true);expect(subjectUnderTest.jam()).toEqual(true);});`
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

import path from 'path';
import * as read from 'read-file';
import getFns from './get-fns';

import * as subjectUnderTest from './create-statements.js';

let testFile;
let fns;

describe('injectIntl', () => {
  beforeAll(() => {
    testFile = read.sync(path.join(process.cwd() + '/test/injectIntl.js'), {
      encoding: 'utf8'
    });

    fns = getFns(testFile);
  });
  describe('createImportStatements', () => {
    it('returns correct string', () => {
      expect(subjectUnderTest.createImportStatements(fns)).toEqual(
        `import isNumberSub from './sub-func';import { createSelector } from 'reselect';import { selectSomeStuff } from '../someLocation';import injectIntl from 'injectIntl';`
      );
    });
    it('returns correct string when ignoreWrappers is true', () => {
      expect(subjectUnderTest.createImportStatements(fns, true)).toEqual(
        `import isNumberSub from './sub-func';import { selectSomeStuff } from '../someLocation';`
      );
    });
  });

  describe('createMockFileStatements', () => {
    it('returns correct string', () => {
      expect(subjectUnderTest.createMockFileStatements(fns)).toEqual(
        `mockFunctions(require('./sub-func'));mockFunctions(require('reselect'));mockFunctions(require('../someLocation'));mockFunctions(require('injectIntl'));`
      );
    });
    it('returns correct string when ignore wrappers is true', () => {
      expect(subjectUnderTest.createMockFileStatements(fns, true)).toEqual(
        `mockFunctions(require('./sub-func'));mockFunctions(require('../someLocation'));`
      );
    });
  });

  describe('createDefaultDescribe', () => {
    it('returns correct string', () => {
      expect(subjectUnderTest.createDefaultDescribe(fns)).toEqual(
        `describe('defaultExport', () => {it('returns true when injectIntl, isNumberSub is true', () => {setMockValue(injectIntl, true);setMockValue(isNumberSub, true);expect(subjectUnderTest.default()).toEqual(true);});});`
      );
    });
  });

  describe('createNamedDescribes', () => {
    it('returns correct string', () => {
      expect(subjectUnderTest.createNamedDescribes(fns)).toEqual(
        `describe('selectIsGoogleAdsEnabled', () => {it('returns true when selectSomeStuff is true', () => {const testValue = 'foo'; setMockValue(selectSomeStuff, true);expect(subjectUnderTest.selectIsGoogleAdsEnabled.resultFunc(selectSomeStuff, testValue).toEqual(true));});});`
      );
    });
  });

  describe('createIt', () => {
    it('returns correct string', () => {
      expect(subjectUnderTest.createIt('jam', ['sub1', 'sub2'])).toEqual(
        `it('returns true when sub1, sub2 is true', () => {setMockValue(sub1, true);setMockValue(sub2, true);expect(subjectUnderTest.jam()).toEqual(true);});`
      );
    });

    it('returns correct reselect string', () => {
      expect(
        subjectUnderTest.createIt('jam', ['createSelector', 'sub2'])
      ).toEqual(
        `it('returns true when sub2 is true', () => {const testValue = 'foo'; setMockValue(sub2, true);expect(subjectUnderTest.jam.resultFunc(sub2, testValue).toEqual(true));});`
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
});

describe('index', () => {
  beforeAll(() => {
    testFile = read.sync(path.join(process.cwd() + '/test/index.js'), {
      encoding: 'utf8'
    });

    fns = getFns(testFile);
  });
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

  describe('createDefaultDescribe', () => {
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
});

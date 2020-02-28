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
    it('returns correct string when ignoreWrappers is set', () => {
      expect(
        subjectUnderTest.createImportStatements(fns, [
          'injectIntl',
          'createSelector'
        ])
      ).toEqual(
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
      expect(
        subjectUnderTest.createMockFileStatements(fns, [
          'injectIntl',
          'createSelector'
        ])
      ).toEqual(
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
        `describe('one', () => {it('returns true', () => {expect(subjectUnderTest.one()).toEqual(true);});});describe('increment', () => {it('returns true', () => {expect(subjectUnderTest.increment()).toEqual(true);});});describe('isString', () => {it('returns true when isStringSub is true', () => {setMockValue(isStringSub, true);expect(subjectUnderTest.isString()).toEqual(true);});});`
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

describe('experienceSwitcher', () => {
  beforeAll(() => {
    testFile = read.sync(
      path.join(process.cwd() + '/test/experienceSwitcher.ts'),
      {
        encoding: 'utf8'
      }
    );

    fns = getFns(testFile);
  });
  describe('createImportStatements', () => {
    it('returns correct string', () => {
      expect(subjectUnderTest.createImportStatements(fns)).toEqual(
        `import { cookies } from 'storageUtils';import { Jams } from 'package/lib/index';import { SCOPES_COOKIE } from '../shared/constants';import TabType from '../shared/enums';import { PlatesDict } from '../shared/entities/locations';import { getScopesFromQuery } from '../shared/scopes';`
      );
    });
  });

  describe('createMockFileStatements', () => {
    it('returns correct string', () => {
      expect(subjectUnderTest.createMockFileStatements(fns)).toEqual(
        `mockFunctions(require('storageUtils'));mockFunctions(require('package/lib/index'));mockFunctions(require('../shared/constants'));mockFunctions(require('../shared/enums'));mockFunctions(require('../shared/entities/locations'));mockFunctions(require('../shared/scopes'));`
      );
    });
  });

  describe('createDefaultDescribe', () => {
    it('returns correct string', () => {
      expect(subjectUnderTest.createDefaultDescribe(fns)).toEqual(``);
    });
  });

  describe('createNamedDescribes', () => {
    it('returns correct string', () => {
      // console.log(JSON.stringify(fns, null, 4));
      expect(subjectUnderTest.createNamedDescribes(fns)).toEqual(
        `describe('CODE', () => {it('returns true', () => {expect(subjectUnderTest.CODE()).toEqual(true);});});describe('setDS', () => {it('returns true when cookies, SCOPES_COOKIE is true', () => {setMockValue(cookies, true);setMockValue(SCOPES_COOKIE, true);expect(subjectUnderTest.setDS()).toEqual(true);});});describe('getCurrentJam', () => {it('returns true when PlatesDict, TabType, Jams is true', () => {setMockValue(PlatesDict, true);setMockValue(TabType, true);setMockValue(Jams, true);expect(subjectUnderTest.getCurrentJam()).toEqual(true);});});describe('getScopesCookie', () => {it('returns true when cookies, SCOPES_COOKIE, getScopesFromQuery is true', () => {setMockValue(cookies, true);setMockValue(SCOPES_COOKIE, true);setMockValue(getScopesFromQuery, true);expect(subjectUnderTest.getScopesCookie()).toEqual(true);});});describe('isRaspberryOrDamson', () => {it('returns true when PlatesDict, Jams, TabType is true', () => {setMockValue(PlatesDict, true);setMockValue(Jams, true);setMockValue(TabType, true);expect(subjectUnderTest.isRaspberryOrDamson()).toEqual(true);});});describe('isDamson', () => {it('returns true when PlatesDict, Jams, TabType is true', () => {setMockValue(PlatesDict, true);setMockValue(Jams, true);setMockValue(TabType, true);expect(subjectUnderTest.isDamson()).toEqual(true);});});describe('isPlumOrStrawberry', () => {it('returns true when PlatesDict, Jams, TabType is true', () => {setMockValue(PlatesDict, true);setMockValue(Jams, true);setMockValue(TabType, true);expect(subjectUnderTest.isPlumOrStrawberry()).toEqual(true);});});`
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

import path from 'path';
import * as read from 'read-file';

import * as subjectUnderTest from './get-fns.js';

describe('defaultExport', () => {
  it('returns correct values', () => {
    const testFile = read.sync(path.join(process.cwd() + '/test/index.js'), {
      encoding: 'utf8'
    });
    const output = subjectUnderTest.default(testFile);
    expect(output).toEqual({
      defaultFn: {
        importedFns: [],
        internalFns: ['a', 'increment', 'internalIsNumberSub']
      },
      namedFns: {
        one: {
          importedFns: [],
          internalFns: []
        },
        increment: {
          importedFns: [],
          internalFns: ['internalIncrement']
        },
        isString: {
          importedFns: ['isStringSub'],
          internalFns: []
        }
      },
      importedFns: [
        {
          name: 'isNumberSub',
          isDefault: true,
          location: './sub-func'
        },
        {
          name: 'isStringSub',
          isDefault: false,
          location: './sub-func'
        }
      ],
      internalFns: {
        internalIncrement: {
          importedFns: [],
          internalFns: []
        },
        internalIsNumberSub2: {
          importedFns: ['isNumberSub'],
          internalFns: []
        },
        internalIsNumberSub: {
          importedFns: [],
          internalFns: ['internalIsNumberSub2']
        },
        two: {
          importedFns: [],
          internalFns: []
        },
        a: {
          importedFns: [],
          internalFns: ['increment']
        }
      }
    });
  });
  it('returns correct values complex file', () => {
    const testFile = read.sync(
      path.join(process.cwd() + '/test/experienceSwitcher.ts'),
      {
        encoding: 'utf8'
      }
    );
    const output = subjectUnderTest.default(testFile);
    // console.log(JSON.stringify(output, null, 2));
    expect(output).toEqual({
      namedFns: {
        CODE: {
          importedFns: [],
          internalFns: []
        },
        setDS: {
          importedFns: [],
          internalFns: ['scopes', 'dss']
        },
        getCurrentJam: {
          importedFns: ['PlatesDict', 'TabType', 'Jams'],
          internalFns: ['isBreakfast', 'dontContainCode', 'platesMissing']
        },
        getScopesCookie: {
          importedFns: ['cookies', 'SCOPES_COOKIE', 'getScopesFromQuery'],
          internalFns: ['scopes', 'dss']
        },
        isRaspberryOrDamson: {
          importedFns: ['PlatesDict', 'Jams'],
          internalFns: ['getCurrentJam']
        },
        isDamson: {
          importedFns: ['PlatesDict', 'Jams'],
          internalFns: ['getCurrentJam']
        },
        isPlumOrStrawberry: {
          importedFns: ['PlatesDict'],
          internalFns: ['isRaspberryOrDamson']
        }
      },
      importedFns: [
        {
          name: 'cookies',
          isDefault: false,
          location: 'storageUtils'
        },
        {
          name: 'Jams',
          isDefault: false,
          location: 'package/lib/index'
        },
        {
          name: 'SCOPES_COOKIE',
          isDefault: false,
          location: '../shared/constants'
        },
        {
          name: 'TabType',
          isDefault: true,
          location: '../shared/enums'
        },
        {
          name: 'PlatesDict',
          isDefault: false,
          location: '../shared/entities/locations'
        },
        {
          name: 'getScopesFromQuery',
          isDefault: false,
          location: '../shared/scopes'
        }
      ],
      internalFns: {
        dss: {
          importedFns: [],
          internalFns: []
        },
        dontContainCode: {
          importedFns: ['PlatesDict'],
          internalFns: ['CODE']
        },
        platesMissing: {
          importedFns: ['PlatesDict'],
          internalFns: []
        },
        isBreakfast: {
          importedFns: [],
          internalFns: ['dontContainCode', 'platesMissing']
        },
        scopes: {
          importedFns: ['cookies', 'SCOPES_COOKIE'],
          internalFns: []
        }
      }
    });
  });
  it('returns correct values ignore list', () => {
    const testFile = read.sync(
      path.join(process.cwd() + '/test/injectIntl.js'),
      {
        encoding: 'utf8'
      }
    );
    const output = subjectUnderTest.default(testFile);
    // console.log(JSON.stringify(output, null, 2));
    expect(output).toEqual({
      defaultFn: {
        importedFns: ['injectIntl'],
        internalFns: ['internalFn']
      },
      namedFns: {
        selectIsGoogleAdsEnabled: {
          importedFns: ['createSelector', 'selectSomeStuff'],
          internalFns: []
        }
      },
      importedFns: [
        {
          name: 'isNumberSub',
          isDefault: true,
          location: './sub-func'
        },
        {
          name: 'createSelector',
          isDefault: false,
          location: 'reselect'
        },
        {
          name: 'selectSomeStuff',
          isDefault: false,
          location: '../someLocation'
        },
        {
          name: 'injectIntl',
          isDefault: true,
          location: 'injectIntl'
        }
      ],
      internalFns: {
        internalFn: {
          importedFns: ['isNumberSub'],
          internalFns: []
        }
      }
    });
  });
});

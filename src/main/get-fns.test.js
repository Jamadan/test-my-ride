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
        internalFns: ['increment', 'internalIsNumberSub']
      },
      namedFns: {
        one: { importedFns: [], internalFns: [] },
        increment: { importedFns: [], internalFns: ['internalIncrement'] },
        isString: { importedFns: ['isStringSub'], internalFns: [] }
      },
      importedFns: [
        { name: 'isNumberSub', isDefault: true, location: './sub-func' },
        { name: 'isStringSub', isDefault: false, location: './sub-func' }
      ],
      internalFns: {
        a: {
          importedFns: [],
          internalFns: ['increment']
        },
        internalIncrement: { importedFns: [], internalFns: [] },
        internalIsNumberSub2: { importedFns: ['isNumberSub'], internalFns: [] },
        internalIsNumberSub: {
          importedFns: [],
          internalFns: ['internalIsNumberSub2']
        },
        two: { importedFns: [], internalFns: [] }
      }
    });
  });
});

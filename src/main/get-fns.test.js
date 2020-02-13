import path from 'path';
import * as read from 'read-file';

import * as subjectUnderTest from './get-fns.js';

describe('defaultExport', () => {
  it('returns true when traverse, traverse, traverse, traverse is true', () => {
    const testFile = read.sync(path.join(process.cwd() + '/test/index.js'), {
      encoding: 'utf8'
    });
    expect(subjectUnderTest.default(testFile)).toEqual({
      defaultFn: ['isNumberSub'],
      importedFns: [
        { isDefault: true, location: './sub-func', name: 'isNumberSub' },
        { isDefault: false, location: './sub-func', name: 'isStringSub' }
      ],
      namedFns: { increment: [], isString: ['isStringSub'] }
    });
  });
});

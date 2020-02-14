import path from 'path';
import * as read from 'read-file';

import * as subjectUnderTest from './get-fns.js';

describe('defaultExport', () => {
  it('returns correct values', () => {
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
  it('returns correct values when fn is supplied', () => {
    const testFile = read.sync(path.join(process.cwd() + '/test/index.js'), {
      encoding: 'utf8'
    });
    expect(subjectUnderTest.default(testFile, 'isString')).toEqual({
      importedFns: [
        {
          isDefault: false,
          location: './sub-func',
          name: 'isStringSub'
        }
      ],
      namedFns: { isString: ['isStringSub'] }
    });
  });
  it('returns correct values when default is supplied', () => {
    const testFile = read.sync(path.join(process.cwd() + '/test/index.js'), {
      encoding: 'utf8'
    });
    expect(subjectUnderTest.default(testFile, 'default')).toEqual({
      importedFns: [
        {
          isDefault: true,
          location: './sub-func',
          name: 'isNumberSub'
        }
      ],
      defaultFn: ['isNumberSub'],
      namedFns: {}
    });
  });
});

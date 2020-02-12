import { mockFile, mockFunction } from 'mock-my-ride';

import * as subFuncs from './sub-func';
mockFile(subFuncs);

// Functions under test
import isNumber, { isString } from './index';

describe('isString', () => {
  it('return true when isStringSub is true', () => {
    mockFunction(subFuncs.isStringSub, true);

    expect(isString()).toEqual(true);
  });
});

describe('isNumber', () => {
  it('return true when isNumberSub is true', () => {
    mockFunction(subFuncs.default, true);

    expect(isNumber()).toEqual(true);
  });
});

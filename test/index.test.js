import { mockFile, mockFunction } from 'mock-my-ride';

import * as subFuncs from './sub-func';
mockFile(subFuncs);
const { isStringSub } = subFuncs;
const isNumberSub = subFuncs.default;

// Functions under test
import isNumber, { isString } from './index';

describe('isString', () => {
  it('return true when isStringSub is true', () => {
    mockFunction(isStringSub, true);

    expect(isString()).toEqual(true);
  });
});

describe('isNumber', () => {
  it('return true when isNumberSub is true', () => {
    mockFunction(isNumberSub, true);

    expect(isNumber()).toEqual(true);
  });
});

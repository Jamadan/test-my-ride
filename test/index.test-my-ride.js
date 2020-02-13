import { mockFile, mockFunction } from 'mock-my-ride';

import * as importFns0 from './sub-func';
mockFile(importFns0);
const isNumberSub = importFns0.default;
const { isStringSub } = importFns0;

import * as subjectUnderTest from '../test/index.js';

describe('defaultExport', () => {
  it('returns true when isNumberSub is true', () => {
    mockFunction(isNumberSub, true);

    expect(subjectUnderTest.default()).toEqual(true);
  });
});

describe('increment', () => {
  it('returns true when  is true', () => {
    expect(subjectUnderTest.increment()).toEqual(true);
  });
});

describe('isString', () => {
  it('returns true when isStringSub is true', () => {
    mockFunction(isStringSub, true);

    expect(subjectUnderTest.isString()).toEqual(true);
  });
});

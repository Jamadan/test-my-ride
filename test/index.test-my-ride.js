// Generated by test-my-ride
// Please update mock valies and tests to appropriate logic

import { mockFunctions, setMockValue } from 'mock-my-ride';

mockFunctions(require('./sub-func'));
import isNumberSub, { isStringSub } from './sub-func';

import * as subjectUnderTest from './index';

describe('defaultExport', () => {
  it('returns true when isNumberSub is true', () => {
    setMockValue(isNumberSub, true);
    expect(subjectUnderTest.default()).toEqual(true);
  });
});

describe('one', () => {
  it('returns true', () => {
    expect(subjectUnderTest.one()).toEqual(true);
  });
});
describe('increment', () => {
  it('returns true', () => {
    expect(subjectUnderTest.increment()).toEqual(true);
  });
});
describe('isString', () => {
  it('returns true when isStringSub is true', () => {
    setMockValue(isStringSub, true);
    expect(subjectUnderTest.isString()).toEqual(true);
  });
});

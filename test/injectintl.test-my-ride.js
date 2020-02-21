import { mockFunctions, setMockValue } from 'mock-my-ride';

mockFunctions(require('./sub-func'));
mockFunctions(require('../someLocation'));
import isNumberSub from './sub-func';
import { selectSomeStuff } from '../someLocation';

import * as subjectUnderTest from './injectintl.js';

describe('defaultExport', () => {
  it('returns true when injectIntl, isNumberSub is true', () => {
    setMockValue(isNumberSub, true);
    expect(subjectUnderTest.default()).toEqual(true);
  });
});

describe('selectIsGoogleAdsEnabled', () => {
  it('returns true when selectSomeStuff is true', () => {
    const testValue = 'foo';
    setMockValue(selectSomeStuff, true);
    expect(
      subjectUnderTest.selectIsGoogleAdsEnabled
        .resultFunc(selectSomeStuff, testValue)
        .toEqual(true)
    );
  });
});

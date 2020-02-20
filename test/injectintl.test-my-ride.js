import { mockFunctions, setMockValue } from 'mock-my-ride';

mockFunctions(require('./sub-func'));
mockFunctions(require('reselect'));
mockFunctions(require('../someLocation'));
mockFunctions(require('injectIntl'));
import isNumberSub from './sub-func';
import { createSelector } from 'reselect';
import { selectSomeStuff } from '../someLocation';
import injectIntl from 'injectIntl';

import * as subjectUnderTest from './injectintl.js';

describe('defaultExport', () => {
  it('returns true when injectIntl, isNumberSub is true', () => {
    setMockValue(injectIntl, true);
    setMockValue(isNumberSub, true);
    expect(subjectUnderTest.default()).toEqual(true);
  });
});

describe('selectIsGoogleAdsEnabled', () => {
  it('returns true when selectSomeStuff, createSelector is true', () => {
    setMockValue(selectSomeStuff, true);
    setMockValue(createSelector, true);
    expect(subjectUnderTest.selectIsGoogleAdsEnabled()).toEqual(true);
  });
});

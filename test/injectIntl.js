import isNumberSub from './sub-func';
import { createSelector } from 'reselect';
import { selectSomeStuff } from '../someLocation';
import injectIntl from 'injectIntl';

export const selectIsGoogleAdsEnabled = createSelector(
  selectSomeStuff,
  entities => entities.ads && entities.ads.isGoogleAdsEnabled
);

const internalFn = val => {
  return isNumberSub(val);
};

export default injectIntl(internalFn);

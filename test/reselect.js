import { createSelector } from 'reselect';
import { selectSomeStuff, selectSomeOtherStuff } from '../someLocation';

export const selectAllStuffIsTrue = createSelector(selectSomeStuff, stuff =>
  stuff.every(st => st === true)
);

export const selectAllCombinedStuffIsTrue = state => {
  const stuff = selectSomeStuff(state);
  const otherStuff = selectSomeOtherStuff(state);

  return [...stuff, ...otherStuff].every(st => st === true);
};

const internalSelectAllStuffTrue = createSelector(selectSomeStuff, stuff =>
  stuff.every(st => st === true)
);

export default internalSelectAllStuffTrue;

import isNumberSub, { isStringSub } from './sub-func';

const internalJam = jam => {
  return jam++;
};

export const increment = number => {
  if (typeof number !== 'number') {
    return undefined;
  } else {
    return internalJam(number);
  }
};

export const isString = val => {
  return isStringSub(val);
};

export default val => {
  return isNumberSub(val);
};

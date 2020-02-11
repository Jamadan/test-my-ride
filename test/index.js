import isNumberSub, { isStringSub } from './sub-func';

export const increment = number => {
  if (typeof number !== 'number') {
    return undefined;
  } else {
    return number++;
  }
};

export const isString = val => {
  return isStringSub(val);
};

export const isNumber = val => {
  return isNumberSub(val);
};

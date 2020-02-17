import isNumberSub, { isStringSub } from './sub-func';

const internalIncrement = val => {
  return val++;
};

const internalIsNumberSub = val => {
  return isNumberSub(val);
};

export const increment = number => {
  if (typeof number !== 'number') {
    return undefined;
  } else {
    return internalIncrement(number);
  }
};

export const isString = val => {
  return isStringSub(val);
};

export default val => {
  return internalIsNumberSub(val);
};

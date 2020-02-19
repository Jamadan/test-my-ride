import isNumberSub, { isStringSub } from './sub-func';

const internalIncrement = val => {
  return val++;
};

const internalIsNumberSub2 = val => {
  return isNumberSub(val);
};

const internalIsNumberSub = val => {
  return internalIsNumberSub2(val);
};

const two = 2;

export const one = {
  '1': 1
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
  const a = increment(1);
  return internalIsNumberSub(val);
};

import { ValueOptions } from '../models/colDef/gridColDef';
import { isObject } from '../utils/utils';

export const isArrayOfObjects = (options: unknown): options is Array<Record<string, any>> => {
  if (!Array.isArray(options)) {
    return false;
  }

  return options.every((option) => option !== null && typeof option === 'object');
};

export const defaultGetOptionValue = (value: ValueOptions) => {
  return isObject(value) ? value.value : value;
};

export const defaultGetOptionLabel = (value: ValueOptions) => {
  return isObject(value) ? value.label : String(value);
};

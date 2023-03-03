import { ValueOptions } from '../models/colDef/gridColDef';
import { isObject } from '../utils/utils';

export const isArrayOfObjects = (options: any): options is Array<Record<string, any>> => {
  return typeof options[0] === 'object';
};

export const defaultGetOptionValue = (value: ValueOptions) => {
  return isObject(value) ? value.value : value;
};

export const defaultGetOptionLabel = (value: ValueOptions) => {
  return isObject(value) ? value.label : String(value);
};

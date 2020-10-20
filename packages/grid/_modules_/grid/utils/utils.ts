import isEqual from '../lib/lodash/isEqual';

export { isEqual };

export interface DebouncedFunction extends Function {
  cancel: () => void;
  flush: () => void;
}

export function isDate(value: any): value is Date {
  return value instanceof Date;
}

export function isArray(value: any): value is Array<any> {
  return Array.isArray(value);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object';
}

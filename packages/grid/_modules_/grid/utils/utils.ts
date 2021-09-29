import * as styles from '@mui/material/styles';
import isDeepEqual from '../lib/lodash/isDeepEqual';

export { isDeepEqual };

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object';
}

export function getMuiVersion(): string {
  if (!('fade' in styles)) {
    return 'v5';
  }

  if ('fade' in styles && 'alpha' in styles) {
    return 'v4.12';
  }

  return 'v4';
}

export function localStorageAvailable() {
  try {
    // Incognito mode might reject access to the localStorage for security reasons.
    // window isn't defined on Node.js
    // https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
    const key = '__some_random_key_you_are_not_going_to_use__';
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    return false;
  }
}

export function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

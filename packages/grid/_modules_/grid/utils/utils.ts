import * as styles from '@material-ui/core/styles';
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

export function getThemePaletteMode(palette: any): string {
  return palette.type || palette.mode;
}

export function isMuiV5(): boolean {
  return 'alpha' in styles;
}

export function muiStyleAlpha(color: string, value: number): string {
  if (isMuiV5()) {
    return (styles as any)?.alpha(color, value);
  }
  return (styles as any)?.fade(color, value);
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

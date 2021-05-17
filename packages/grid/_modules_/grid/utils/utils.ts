import * as styles from '@material-ui/core/styles';
import { GRID_CSS_CLASS_PREFIX } from '../constants/cssClassesConstants';
import isDeepEqual from '../lib/lodash/isDeepEqual';
import { GridCellValue } from '../models/gridCell';
import { generateUtilityClass } from './material-ui-utils';

export { isDeepEqual };

export function isDate(value: any): value is Date {
  return value instanceof Date;
}
export function isDateValid(value: Date): boolean {
  return !Number.isNaN(value.getTime());
}

export function parseDate(value: string): Date {
  const [year, month, day] = value.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function parseDateTime(value: string): Date {
  const [date, time] = value.split('T');
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
}

export function formatDateToLocalInputDate({
  value,
  withTime,
}: {
  value: GridCellValue;
  withTime: boolean;
}) {
  if (isDate(value) && isDateValid(value)) {
    const offset = value.getTimezoneOffset();
    const localDate = new Date(value.getTime() - offset * 60 * 1000);
    return localDate.toISOString().substr(0, withTime ? 16 : 10);
  }
  return value;
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

export function mapColDefTypeToInputType(type: string) {
  switch (type) {
    case 'string':
      return 'text';
    case 'number':
    case 'date':
      return type;
    case 'dateTime':
      return 'datetime-local';
    default:
      return 'text';
  }
}

// Util to make specific interface properties optional
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export function getDataGridUtilityClass(slot) {
  return generateUtilityClass(GRID_CSS_CLASS_PREFIX, slot);
}

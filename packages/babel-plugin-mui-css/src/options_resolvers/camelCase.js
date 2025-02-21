import { isBoolean } from '../utils';

/**
 * Resolves camelCase option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {boolean}
 */
export default function camelCase(value /* , currentConfig */) {
  if (!isBoolean(value) && ['dashes', 'dashesOnly', 'only'].indexOf(value) < 0) {
    throw new Error(
      `Configuration 'camelCase' is not a boolean or one of 'dashes'|'dashesOnly'|'only'`,
    );
  }

  return value;
}

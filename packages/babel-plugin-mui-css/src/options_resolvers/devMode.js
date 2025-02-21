import { isBoolean } from '../utils';

/**
 * Resolves devMode option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {boolean}
 */
export default function devMode(value /* , currentConfig */) {
  if (!isBoolean(value)) {
    throw new Error(`Configuration 'devMode' is not a boolean`);
  }

  return value;
}

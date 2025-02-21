import { isString } from '../utils';

/**
 * Resolves mode option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {String}
 */
export default function mode(value /* , currentConfig */) {
  if (!isString(value)) {
    throw new Error(`Configuration 'mode' is not a string`);
  }

  return value;
}

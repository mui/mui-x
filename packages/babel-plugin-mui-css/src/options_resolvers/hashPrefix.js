import { isString } from '../utils';

/**
 * Resolves hashPrefix option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {String}
 */
export default function hashPrefix(value /* , currentConfig */) {
  if (!isString(value)) {
    throw new Error(`Configuration 'hashPrefix' is not a string`);
  }

  return value;
}

import { isString } from '../utils';

/**
 * Resolves extensions for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Array.<String>}
 */
export default function extensions(value /* , currentConfig */) {
  if (Array.isArray(value)) {
    return value.map((extension, index) => {
      if (!isString(extension)) {
        throw new Error(`Configuration 'extensions[${index}]' is not a string`);
      }

      return extension;
    });
  }

  throw new Error(`Configuration 'extensions' is not an array`);
}

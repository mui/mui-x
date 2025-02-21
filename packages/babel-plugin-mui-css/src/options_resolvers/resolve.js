import { isAbsolute } from 'path';
import { statSync } from 'fs';
import { isBoolean, isPlainObject, isString } from '../utils';

/**
 * Resolves resolve option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Object}
 */
export default function resolve(value /* , currentConfig */) {
  if (!isPlainObject(value)) {
    throw new Error(`Configuration 'resolve' is not an object`);
  }

  if ('alias' in value && !isPlainObject(value.alias)) {
    throw new Error(`Configuration 'resolve.alias' is not an object`);
  }

  if ('extensions' in value) {
    if (!Array.isArray(value.extensions)) {
      throw new Error(`Configuration 'resolve.extensions' is not an array`);
    }

    value.extensions.map((option, index) => {
      if (!isString(option)) {
        throw new Error(`Configuration 'resolve.extensions[${index}]' is not a string`);
      }
    });
  }

  if ('modules' in value) {
    if (!Array.isArray(value.modules)) {
      throw new Error(`Configuration 'resolve.modules' is not an array`);
    }

    value.modules.map((option, index) => {
      if (!isAbsolute(option) || !statSync(option).isDirectory()) {
        throw new Error(
          `Configuration 'resolve.modules[${index}]' is not containing a valid absolute path`,
        );
      }
    });
  }

  if ('mainFile' in value && !isString(value.mainFile)) {
    throw new Error(`Configuration 'resolve.mainFile' is not a string`);
  }

  if ('preserveSymlinks' in value && !isBoolean(value.preserveSymlinks)) {
    throw new Error(`Configuration 'resolve.preserveSymlinks' is not a boolean`);
  }

  return value;
}

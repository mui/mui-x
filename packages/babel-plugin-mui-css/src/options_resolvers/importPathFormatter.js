import { isFunction, isModulePath, requireLocalFileOrNodeModule } from '../utils';

/**
 * Resolves importPathFormatter option
 *
 * @param {String|Function} value
 * @returns {Function}
 */
export default function importPathFormatter(value /* , currentConfig */) {
  if (isFunction(value)) {
    return value;
  } else if (isModulePath(value)) {
    const requiredOption = requireLocalFileOrNodeModule(value);

    if (!isFunction(requiredOption)) {
      throw new Error(`Configuration file for 'importPathFormatter' is not exporting a function`);
    }

    return requiredOption;
  }

  throw new Error(`Configuration 'importPathFormatter' is not a function nor a valid module path`);
}

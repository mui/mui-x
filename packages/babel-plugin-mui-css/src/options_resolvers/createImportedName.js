import { isFunction, isModulePath, requireLocalFileOrNodeModule } from '../utils';

/**
 * Resolves createImportedName css-modules-require-hook option
 *
 * @param {String|Function} value
 * @returns {Function}
 */
export default function createImportedName(value /* , currentConfig */) {
  if (isFunction(value)) {
    return value;
  } else if (isModulePath(value)) {
    const requiredOption = requireLocalFileOrNodeModule(value);

    if (!isFunction(requiredOption)) {
      throw new Error(`Configuration file for 'createImportedName' is not exporting a function`);
    }

    return requiredOption;
  }

  throw new Error(`Configuration 'createImportedName' is not a function nor a valid module path`);
}

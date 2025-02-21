import { isModulePath, isFunction, isString, requireLocalFileOrNodeModule } from '../utils';

/**
 * Resolves generateScopedName option for css-modules-require-hook
 *
 * @param {String|Function} value
 *
 * @returns {String|Function}
 */
export default function generateScopedName(value /* ,currentConfig */) {
  if (isModulePath(value)) {
    const requiredModule = requireLocalFileOrNodeModule(value);

    if (isString(requiredModule) || isFunction(requiredModule)) {
      return requiredModule;
    }

    throw new Error(
      `Configuration file for 'generateScopedName' is not exporting a string nor a function`,
    );
  } else if (isString(value) || isFunction(value)) {
    return value;
  } else {
    throw new Error(
      `Configuration 'generateScopedName' is not a function, string nor valid path to module`,
    );
  }
}

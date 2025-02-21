import { isModulePath, isFunction, requireLocalFileOrNodeModule } from '../utils';

/**
 * Resolves processCss option for css-modules-require-hook
 *
 * @param {String|Function} value
 *
 * @returns {String|Function}
 */
export default function processCss(value /* ,currentConfig */) {
  if (isModulePath(value)) {
    const requiredModule = requireLocalFileOrNodeModule(value);

    if (isFunction(requiredModule)) {
      return requiredModule;
    }

    throw new Error(`Configuration file for 'processCss' is not exporting a function`);
  } else if (isFunction(value)) {
    return value;
  } else {
    throw new Error(`Configuration 'processCss' is not a function nor a valid path to module`);
  }
}

import { isModulePath, isFunction, requireLocalFileOrNodeModule } from '../utils';

/**
 * Resolves preprocessCss option for css-modules-require-hook
 *
 * @param {String|Function} value
 *
 * @returns {String|Function}
 */
export default function preprocessCss(value /* ,currentConfig */) {
  if (isModulePath(value)) {
    const requiredModule = requireLocalFileOrNodeModule(value);

    if (isFunction(requiredModule)) {
      return requiredModule;
    }

    throw new Error(`Configuration file for 'preprocessCss' is not exporting a function`);
  } else if (isFunction(value)) {
    return value;
  } else {
    throw new Error(`Configuration 'preprocessCss' is not a function nor a valid path to module`);
  }
}

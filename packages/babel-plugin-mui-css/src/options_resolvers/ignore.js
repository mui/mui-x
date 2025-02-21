import {
  isFunction,
  isModulePath,
  isRegExp,
  isString,
  requireLocalFileOrNodeModule,
} from '../utils';

/**
 * Resolves ignore option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Function|String|RegExp}
 */
export default function ignore(value /* , currentConfig */) {
  if (isFunction(value) || isRegExp(value)) {
    return value;
  } else if (isModulePath(value)) {
    const requiredOption = requireLocalFileOrNodeModule(value);

    if (isFunction(requiredOption) || isString(requiredOption) || isRegExp(requiredOption)) {
      return requiredOption;
    }

    throw new Error(`Configuration file for 'ignore' is not exporting a string nor a function`);
  } else if (isString(value)) {
    return value;
  } else {
    throw new Error(
      `Configuration 'ignore' is not a function, string, RegExp nor valid path to module`,
    );
  }
}

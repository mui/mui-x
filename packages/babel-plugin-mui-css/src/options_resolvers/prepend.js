import { isFunction, isModulePath, requireLocalFileOrNodeModule } from '../utils';

/**
 * Resolves prepend option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Function}
 */
export default function prepend(value /* , currentConfig */) {
  if (Array.isArray(value)) {
    return value.map((option, index) => {
      if (isFunction(option)) {
        return option();
      } else if (isModulePath(option)) {
        const requiredOption = requireLocalFileOrNodeModule(option);

        if (!isFunction(requiredOption)) {
          throw new Error(`Configuration 'prepend[${index}]' module is not exporting a function`);
        }

        return requiredOption();
      }

      throw new Error(`Configuration 'prepend[${index}]' is not a function or a valid module path`);
    });
  }

  throw new Error(`Configuration 'prepend' is not an array`);
}

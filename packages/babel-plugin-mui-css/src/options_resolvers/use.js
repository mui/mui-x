import { isFunction, isModulePath, requireLocalFileOrNodeModule } from '../utils';

/**
 * Resolves use option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Function}
 */
export default function use(value /* , currentConfig */) {
  if (Array.isArray(value)) {
    return value.map((option, index) => {
      if (isFunction(option)) {
        return option();
      } else if (isModulePath(option)) {
        const requiredOption = requireLocalFileOrNodeModule(option);

        if (!isFunction(requiredOption)) {
          throw new Error(`Configuration 'use[${index}]' module is not exporting a function`);
        }

        return requiredOption();
      }

      throw new Error(`Configuration 'use[${index}]' is not a function or a valid module path`);
    });
  }

  throw new Error(`Configuration 'use' is not an array`);
}

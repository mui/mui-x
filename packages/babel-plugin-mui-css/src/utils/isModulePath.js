import { resolve as resolvePath } from 'path';
import isString from './isString.js';

/**
 * Is given path a valid file or node module path?
 *
 * @param {String} path
 * @returns {boolean}
 */
export default function isModulePath(path) {
  if (!isString(path) || path === '') {
    return false;
  }

  try {
    require.resolve(resolvePath(process.cwd(), path));
    return true;
  } catch (e) {
    try {
      require.resolve(path);
      return true;
    } catch (_e) {
      return false;
    }
  }
}

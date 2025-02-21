import { resolve as resolvePath } from 'path';

/**
 * Require local file or node modules
 *
 * @param {String} path
 * @returns {*}
 */
export default function requireLocalFileOrNodeModule(path) {
  const localFile = resolvePath(process.cwd(), path);

  try {
    // first try to require local file
    return require(localFile);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      // try to require node_module
      return require(path);
    }

    throw e;
  }
}

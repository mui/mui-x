import mkdirp from 'mkdirp';
import { dirname } from 'path';
import { appendFileSync, writeFileSync } from 'fs';

/**
 * Writes css file to given path (and creates directories)
 *
 * @param {String} path
 * @param {String} content
 * @param {Boolean} append
 */
export default function writeCssFile(path, content, append = false) {
  mkdirp.sync(dirname(path));

  if (append) {
    appendFileSync(path, content);
  } else {
    writeFileSync(path, content);
  }
}

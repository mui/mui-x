import { basename, dirname, extname, join, relative, resolve } from 'path';
import writeCssFile from './writeCssFile.js';

export const PATH_VARIABLES = ['[path]', '[name]'];

/**
 * Extracts CSS to file
 *
 * @param {String} cwd
 * @param {Map} cssMap
 * @param {String|Object} extractCss
 * @returns {null}
 */
export default function extractCssFile(cwd, cssMap, extractCss) {
  // this is the case where a single extractCss is requested
  if (typeof extractCss === 'string') {
    // check if extractCss contains some from pattern variables, if yes throw!
    PATH_VARIABLES.forEach((VARIABLE) => {
      if (extractCss.indexOf(VARIABLE) !== -1) {
        throw new Error('extractCss cannot contain variables');
      }
    });

    const css = Array.from(cssMap.values()).join('');

    return writeCssFile(extractCss, css);
  }

  // This is the case where each css file is written in
  // its own file.
  const { dir = 'dist', filename = '[name].css', relativeRoot = '' } = extractCss;

  // check if filename contains at least [name] variable
  if (filename.indexOf('[name]') === -1) {
    throw new Error('[name] variable has to be used in extractCss.filename option');
  }

  cssMap.forEach((css, filepath) => {
    // Make css file name relative to relativeRoot
    const relativePath = relative(resolve(cwd, relativeRoot), filepath);

    const destination = join(resolve(cwd, dir), filename)
      .replace(/\[name]/, basename(filepath, extname(filepath)))
      .replace(/\[path]/, dirname(relativePath));

    writeCssFile(destination, css);
  });
}

/**
 * Is Provided object an RegExp?
 *
 * @param {*} object
 * @returns {boolean}
 */
export default function isRegExp(object) {
  return object instanceof RegExp;
}

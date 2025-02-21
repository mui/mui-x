/**
 * Is provided value an plain object?
 *
 * @param {*} object
 * @returns {boolean}
 */
export default function isPlainObject(object) {
  if (object === null || object === undefined) {
    return false;
  }

  return object.toString() === '[object Object]';
}

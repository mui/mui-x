import { fastArrayCompare } from '../fastArrayCompare';
import { fastObjectShallowCompare } from '../fastObjectShallowCompare';

/**
 * Fast shallow compare.
 *
 * Builds on top of `fastArrayCompare` and `fastObjectShallowCompare` and uses them for their respective types.
 *
 * @returns true if `a` and `b` are equal.
 */
export function fastShallowCompare(a: any, b: any) {
  if (Array.isArray(a)) {
    return fastArrayCompare(a, b);
  }
  if (b instanceof Object) {
    return fastObjectShallowCompare(a, b);
  }
  return Object.is(a, b);
}

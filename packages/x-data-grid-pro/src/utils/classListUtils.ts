/**
 * Adds classes from `composeClasses`, which can hold the default class and custom ones separated by spaces.
 * `classList.add` throws on a token with a space.
 * @param {Element | null | undefined} element The element to update.
 * @param {string} className Space-separated classes.
 */
export function addClasses(element: Element | null | undefined, className: string) {
  element?.classList.add(...className.split(' ').filter(Boolean));
}

/**
 * Removes classes added with `addClasses`.
 * @param {Element | null | undefined} element The element to update.
 * @param {string} className Space-separated classes.
 */
export function removeClasses(element: Element | null | undefined, className: string) {
  element?.classList.remove(...className.split(' ').filter(Boolean));
}

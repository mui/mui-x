/**
 * Returns the center coordinates of an element's bounding rect.
 * Useful for simulating pointer events at the center of chart elements.
 */
export function getCenter(el: Element) {
  const rect = el.getBoundingClientRect();
  return { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
}

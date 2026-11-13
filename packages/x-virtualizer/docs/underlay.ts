// Helpers for the sticky demos' underlay (see `useScrollUnderlay`): copies of rendered
// elements of typical size, so it looks like what the demos render.

/** A copy of a rendered element, without ids, which have to stay unique. */
export function clone<T extends Element>(element: T) {
  const copy = element.cloneNode(true) as T;
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach((child) => child.removeAttribute('id'));
  return copy;
}

/**
 * `count` of the elements, picked at random among those of typical size: the middle half
 * by content width, so a few far longer or shorter values never end up in the underlay.
 * Shuffled and taken in turn, so the picks differ while there are enough elements.
 */
export function pickTypical<T extends Element>(elements: T[], count: number) {
  const contents = elements[0].ownerDocument.createRange();
  const widths = elements.map((element) => {
    contents.selectNodeContents(element);
    return contents.getBoundingClientRect().width;
  });
  const sorted = [...widths].sort((a, b) => a - b);
  const low = sorted[Math.floor((sorted.length - 1) / 4)];
  const high = sorted[Math.ceil(((sorted.length - 1) * 3) / 4)];
  const typical = elements.filter((_, index) => widths[index] >= low && widths[index] <= high);
  for (let index = typical.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [typical[index], typical[other]] = [typical[other], typical[index]];
  }
  return Array.from({ length: count }, (_, index) => typical[index % typical.length]);
}

/**
 * A box for underlay items, placed and sized like the rendered `row`: the underlay content
 * moving with the horizontal scroll is laid out from the left edge of the content.
 */
export function createItemsBox(item: HTMLElement, scroller: HTMLElement) {
  const box = item.ownerDocument.createElement('div');
  const itemBox = item.getBoundingClientRect();
  box.style.position = 'absolute';
  box.style.left = `${itemBox.left - scroller.getBoundingClientRect().left + scroller.scrollLeft}px`;
  box.style.width = `${itemBox.width}px`;
  return box;
}

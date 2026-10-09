import getActiveElement from '@mui/utils/getActiveElement';

/**
 * Whether focus goes away with `container` when it unmounts: it is on the document, or inside
 * `container`. Focus already moved elsewhere is left alone.
 */
export function isFocusLostWith(container: HTMLElement): boolean {
  const ownerDocument = container.ownerDocument;
  // `getActiveElement` pierces shadow roots, where `document.activeElement` stops at the host.
  const activeElement = getActiveElement(ownerDocument);
  return (
    activeElement === null ||
    activeElement === ownerDocument.body ||
    container.contains(activeElement)
  );
}

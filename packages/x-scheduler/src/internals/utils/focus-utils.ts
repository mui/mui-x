import getActiveElement from '@mui/utils/getActiveElement';

/** Whether focus is on the document, which is where it lands when the focused element unmounts. */
export function isFocusOnDocument(ownerDocument: Document): boolean {
  // `getActiveElement` pierces shadow roots, where `document.activeElement` stops at the host.
  const activeElement = getActiveElement(ownerDocument);
  return activeElement === null || activeElement === ownerDocument.body;
}

/**
 * Whether focus goes away with `container` when it unmounts: it is on the document, or inside
 * `container`.
 */
export function isFocusLostWith(container: HTMLElement): boolean {
  const ownerDocument = container.ownerDocument;
  return isFocusOnDocument(ownerDocument) || container.contains(getActiveElement(ownerDocument));
}

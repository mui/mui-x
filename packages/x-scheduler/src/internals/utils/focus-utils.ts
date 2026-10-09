import { activeElement, contains } from '@base-ui/utils/shadowDom';

// Both helpers pierce shadow roots, where `document.activeElement` stops at the host.

/** Whether focus is on the document, which is where it lands when the focused element unmounts. */
export function isFocusOnDocument(ownerDocument: Document): boolean {
  const focused = activeElement(ownerDocument);
  return focused === null || focused === ownerDocument.body;
}

/**
 * Whether focus goes away with `container` when it unmounts: it is on the document, or inside
 * `container`.
 */
export function isFocusLostWith(container: HTMLElement): boolean {
  const ownerDocument = container.ownerDocument;
  return isFocusOnDocument(ownerDocument) || contains(container, activeElement(ownerDocument));
}

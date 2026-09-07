/**
 * Reads the Content Security Policy nonce used by the styles of a document.
 * Browsers clear the `nonce` content attribute once the element is inserted, so the value is read
 * from the IDL attribute, falling back to the content attribute for browsers that keep it.
 * @param root Document or ShadowRoot to read the nonce from
 * @returns the nonce of the first style element that has one, or `undefined` if there is none
 */
export function getStyleNonce(root: Document | ShadowRoot): string | undefined {
  const styleElements = root.querySelectorAll<HTMLStyleElement | HTMLLinkElement>(
    'style, link[rel="stylesheet"]',
  );

  for (let i = 0; i < styleElements.length; i += 1) {
    const nonce = styleElements[i].nonce || styleElements[i].getAttribute('nonce');

    if (nonce) {
      return nonce;
    }
  }

  return undefined;
}

/**
 * Loads all stylesheets from the given root element into the document.
 * @returns an array of promises that resolve when each stylesheet is loaded
 * @param document Document to load stylesheets into
 * @param root Document or ShadowRoot to load stylesheets from
 * @param nonce Optional nonce to set on style elements for CSP compliance
 */
export function loadStyleSheets(document: Document, root: Document | ShadowRoot, nonce?: string) {
  const stylesheetLoadPromises: Promise<void>[] = [];
  const headStyleElements = root.querySelectorAll("style, link[rel='stylesheet']");

  for (let i = 0; i < headStyleElements.length; i += 1) {
    const node = headStyleElements[i];
    const newHeadStyleElements = document.createElement(node.tagName);

    if (node.tagName === 'STYLE') {
      const sheet = (node as HTMLStyleElement).sheet;

      if (sheet) {
        let styleCSS = '';
        for (let j = 0; j < sheet.cssRules.length; j += 1) {
          if (typeof sheet.cssRules[j].cssText === 'string') {
            styleCSS += `${sheet.cssRules[j].cssText}\r\n`;
          }
        }
        newHeadStyleElements.appendChild(document.createTextNode(styleCSS));
      }
    } else if (node.getAttribute('href')) {
      for (let j = 0; j < node.attributes.length; j += 1) {
        const attr = node.attributes[j];
        if (attr) {
          newHeadStyleElements.setAttribute(attr.nodeName, attr.nodeValue || '');
        }
      }

      stylesheetLoadPromises.push(
        new Promise((resolve) => {
          newHeadStyleElements.addEventListener('load', () => resolve());
        }),
      );
    }

    if (nonce) {
      newHeadStyleElements.nonce = nonce;
    }

    document.head.appendChild(newHeadStyleElements);
  }

  return stylesheetLoadPromises;
}

/**
 * Loads all stylesheets from the given root element into the document.
 * @returns an array of promises that resolve when each stylesheet is loaded
 * @param document Document to load stylesheets into
 * @param root Document or ShadowRoot to load stylesheets from
 */
export function loadStyleSheets(document: Document, root: Document | ShadowRoot) {
  const stylesheetLoadPromises: Promise<void>[] = [];
  const headStyleElements = root.querySelectorAll("style, link[rel='stylesheet']");

  for (let i = 0; i < headStyleElements.length; i += 1) {
    const node = headStyleElements[i];
    if (node.tagName === 'STYLE') {
      const newHeadStyleElements = document.createElement(node.tagName);
      const sheet = (node as HTMLStyleElement).sheet;

      if (sheet) {
        let styleCSS = '';
        // NOTE: for-of is not supported by IE
        for (let j = 0; j < sheet.cssRules.length; j += 1) {
          if (typeof sheet.cssRules[j].cssText === 'string') {
            styleCSS += `${sheet.cssRules[j].cssText}\r\n`;
          }
        }
        newHeadStyleElements.appendChild(document.createTextNode(styleCSS));
        document.head.appendChild(newHeadStyleElements);
      }
    } else if (node.getAttribute('href')) {
      // If `href` tag is empty, avoid loading these links

      const newHeadStyleElements = document.createElement(node.tagName);

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

      document.head.appendChild(newHeadStyleElements);
    }
  }

  return stylesheetLoadPromises;
}

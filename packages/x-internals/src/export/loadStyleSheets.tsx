import { warnOnce } from '../warning';

export interface LoadStyleSheetsOptions {
  /**
   * Optional nonce to set on style elements for CSP compliance.
   */
  nonce?: string;
  /**
   * Called when a stylesheet fails to load. The stylesheet is skipped either way, so this is a
   * notification, not a way to stop the export.
   * @param {HTMLLinkElement} element The stylesheet link element that failed to load.
   * @returns {void}
   */
  onStylesheetError?: (element: HTMLLinkElement) => void;
}

/**
 * Loads all stylesheets from the given root element into the document.
 * @returns an array of promises that resolve when each stylesheet is loaded
 * @param document Document to load stylesheets into
 * @param root Document or ShadowRoot to load stylesheets from
 * @param options Options to apply while copying the stylesheets
 */
export function loadStyleSheets(
  document: Document,
  root: Document | ShadowRoot,
  options: LoadStyleSheetsOptions = {},
) {
  const { nonce, onStylesheetError } = options;
  const stylesheetLoadPromises: Promise<void>[] = [];
  const headStyleElements = root.querySelectorAll("style, link[rel='stylesheet']");

  for (let i = 0; i < headStyleElements.length; i += 1) {
    const node = headStyleElements[i];
    const newHeadStyleElement = document.createElement(node.tagName);

    if (node.tagName === 'STYLE') {
      const sheet = (node as HTMLStyleElement).sheet;

      if (sheet) {
        let styleCSS = '';
        for (let j = 0; j < sheet.cssRules.length; j += 1) {
          if (typeof sheet.cssRules[j].cssText === 'string') {
            styleCSS += `${sheet.cssRules[j].cssText}\r\n`;
          }
        }
        newHeadStyleElement.appendChild(document.createTextNode(styleCSS));
      }
    } else if (node.getAttribute('href')) {
      for (let j = 0; j < node.attributes.length; j += 1) {
        const attr = node.attributes[j];
        if (attr) {
          newHeadStyleElement.setAttribute(attr.nodeName, attr.nodeValue || '');
        }
      }

      stylesheetLoadPromises.push(
        new Promise((resolve) => {
          newHeadStyleElement.addEventListener('load', () => resolve());
          /* A stylesheet blocked by the Content Security Policy, or that fails to load, only fires
           * `error`. Without this the export would wait for a `load` event that never comes. */
          newHeadStyleElement.addEventListener('error', () => {
            if (onStylesheetError) {
              onStylesheetError(newHeadStyleElement as HTMLLinkElement);
            } else {
              warnOnce(
                `MUI X: Failed to load the stylesheet "${node.getAttribute('href')}" in the export document. The export continues without it, so the result may be missing styles.\nThis can happen if the request fails, or if a Content Security Policy blocks the stylesheet.\nPass \`onStylesheetError\` to the export to handle this yourself.`,
              );
            }
            resolve();
          });
        }),
      );
    }

    if (nonce) {
      newHeadStyleElement.setAttribute('nonce', nonce);
    }

    document.head.appendChild(newHeadStyleElement);

    if (nonce) {
      // I don't understand why we need to set the nonce again after appending the element, but I've tested it, and it's
      // the only way I could find to fix Chrome's warning about a CSP violation.
      newHeadStyleElement.setAttribute('nonce', nonce);
    }
  }

  return stylesheetLoadPromises;
}

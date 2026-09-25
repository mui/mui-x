import { warnOnce } from '../warning';

/**
 * Why a stylesheet failed to load:
 * - `'content-security-policy'`: the Content Security Policy blocked it.
 * - `'load-error'`: the request failed, or a stylesheet it imports failed to load.
 */
export type StylesheetErrorReason = 'content-security-policy' | 'load-error';

export interface LoadStyleSheetsOptions {
  /**
   * Optional nonce to set on style elements for CSP compliance.
   */
  nonce?: string;
  /**
   * Called when a stylesheet, or a stylesheet it imports, fails to load.
   * Return or resolve to `false` to cancel the export, throw or reject to make it fail, or return anything else to continue.
   * @param {HTMLLinkElement} element The stylesheet link element that failed to load, or whose import failed to load.
   * @param {StylesheetErrorReason} reason Why the stylesheet failed to load.
   * @returns {Promise<boolean | void> | boolean | void} `false` to cancel the export. If a promise is returned, the export waits for it to settle before proceeding.
   */
  onStylesheetError?: (
    element: HTMLLinkElement,
    reason: StylesheetErrorReason,
  ) => Promise<boolean | void> | boolean | void;
}

/**
 * Loads all stylesheets from the given root element into the document.
 * @returns an array of promises that resolve to `false` when `onStylesheetError` cancels the export and to `true` otherwise, and reject when `onStylesheetError` throws or rejects
 * @param document Document to load stylesheets into
 * @param root Document or ShadowRoot to load stylesheets from
 * @param options Options to apply while copying the stylesheets
 */
export function loadStyleSheets(
  document: Document,
  root: Document | ShadowRoot,
  options: LoadStyleSheetsOptions = {},
) {
  const {
    nonce,
    onStylesheetError: handleStylesheetError = (element, reason) =>
      warnOnce(
        reason === 'content-security-policy'
          ? `MUI X: The Content Security Policy blocked the stylesheet "${element.getAttribute('href')}" in the export document. The export continues without it, so the result may be missing styles.\nSet the \`nonce\` export option to the nonce used by your Content Security Policy, or pass \`onStylesheetError\` to the export to handle this yourself.`
          : `MUI X: The stylesheet "${element.getAttribute('href')}", or a stylesheet it imports, failed to load in the export document. The export continues, so the result may be missing some styles.\nPass \`onStylesheetError\` to the export to handle this yourself.`,
      ),
  } = options;
  const stylesheetLoadPromises: Promise<boolean>[] = [];

  /* Browsers fire `securitypolicyviolation` on the document, before the stylesheet's `error` event. */
  const blockedUrls: string[] = [];
  document.addEventListener('securitypolicyviolation', (event) => {
    blockedUrls.push(event.blockedURI);
  });
  const getErrorReason = (element: HTMLLinkElement): StylesheetErrorReason =>
    blockedUrls.includes(element.href) ? 'content-security-policy' : 'load-error';
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
        new Promise((resolve, reject) => {
          newHeadStyleElement.addEventListener('load', () => resolve(true));
          /* A stylesheet that is blocked by the Content Security Policy, fails to load, or has an `@import` that
           * fails to load only fires `error`. Without this the export would wait for a `load` event that never comes. */
          newHeadStyleElement.addEventListener('error', () => {
            /* The chain turns a synchronous throw into a rejection, so the promise always settles. */
            Promise.resolve()
              .then(() =>
                handleStylesheetError(
                  newHeadStyleElement as HTMLLinkElement,
                  getErrorReason(newHeadStyleElement as HTMLLinkElement),
                ),
              )
              .then((result) => resolve(result !== false), reject);
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

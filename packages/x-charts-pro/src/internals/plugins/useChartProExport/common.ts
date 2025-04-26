import ownerDocument from '@mui/utils/ownerDocument';

export function createExportIframe(title?: string): HTMLIFrameElement {
  const iframeEl = document.createElement('iframe');
  iframeEl.style.position = 'absolute';
  iframeEl.style.width = '0px';
  iframeEl.style.height = '0px';
  iframeEl.title = title || document.title;
  return iframeEl;
}

export function loadStyleSheets(document: Document, element: HTMLElement | SVGElement) {
  const stylesheetLoadPromises: Promise<void>[] = [];
  const doc = ownerDocument(element);

  const rootCandidate = element.getRootNode();
  const root =
    rootCandidate.constructor.name === 'ShadowRoot' ? (rootCandidate as ShadowRoot) : doc;
  const headStyleElements = root!.querySelectorAll("style, link[rel='stylesheet']");

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

  return Promise.all(stylesheetLoadPromises);
}

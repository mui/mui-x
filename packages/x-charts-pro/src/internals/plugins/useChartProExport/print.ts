import ownerDocument from '@mui/utils/ownerDocument';
import { ChartPrintExportOptions } from './useChartProExport.types';

export function printChart(
  element: HTMLElement | SVGElement,
  { fileName }: ChartPrintExportOptions,
) {
  const printWindow = buildPrintWindow(fileName);
  const doc = ownerDocument(element);

  printWindow.onload = async () => {
    const printDoc = printWindow.contentDocument!;
    const elementClone = element!.cloneNode(true) as HTMLElement | SVGElement;
    const container = document.createElement('div');
    container.appendChild(elementClone);
    printDoc.body.innerHTML = container.innerHTML;

    await loadStyleSheets(printDoc, element);

    printWindow.contentWindow!.print();

    const mediaQueryList = printWindow.contentWindow!.matchMedia('print');
    mediaQueryList.addEventListener('change', (mql) => {
      const isAfterPrint = mql.matches === false;
      if (isAfterPrint) {
        doc.body.removeChild(printWindow);
      }
    });
  };
  doc.body.appendChild(printWindow);
}

function buildPrintWindow(title?: string): HTMLIFrameElement {
  const iframeEl = document.createElement('iframe');
  iframeEl.style.position = 'absolute';
  iframeEl.style.width = '0px';
  iframeEl.style.height = '0px';
  iframeEl.title = title || document.title;
  return iframeEl;
}

function loadStyleSheets(printDoc: Document, element: HTMLElement | SVGElement) {
  const stylesheetLoadPromises: Promise<void>[] = [];
  const doc = ownerDocument(element);

  const rootCandidate = element.getRootNode();
  const root =
    rootCandidate.constructor.name === 'ShadowRoot' ? (rootCandidate as ShadowRoot) : doc;
  const headStyleElements = root!.querySelectorAll("style, link[rel='stylesheet']");

  for (let i = 0; i < headStyleElements.length; i += 1) {
    const node = headStyleElements[i];
    if (node.tagName === 'STYLE') {
      const newHeadStyleElements = printDoc.createElement(node.tagName);
      const sheet = (node as HTMLStyleElement).sheet;

      if (sheet) {
        let styleCSS = '';
        // NOTE: for-of is not supported by IE
        for (let j = 0; j < sheet.cssRules.length; j += 1) {
          if (typeof sheet.cssRules[j].cssText === 'string') {
            styleCSS += `${sheet.cssRules[j].cssText}\r\n`;
          }
        }
        newHeadStyleElements.appendChild(printDoc.createTextNode(styleCSS));
        printDoc.head.appendChild(newHeadStyleElements);
      }
    } else if (node.getAttribute('href')) {
      // If `href` tag is empty, avoid loading these links

      const newHeadStyleElements = printDoc.createElement(node.tagName);

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

      printDoc.head.appendChild(newHeadStyleElements);
    }
  }

  return Promise.all(stylesheetLoadPromises);
}

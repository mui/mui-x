import ownerDocument from '@mui/utils/ownerDocument';
import { loadStyleSheets } from '@mui/x-internals/export';
import { copyCanvasesContent, createExportIframe } from './common';
import type { ChartPrintExportOptions } from './useChartProExport.types';
import { defaultOnBeforeExport } from './defaults';

export function printChart(
  element: Element,
  {
    fileName,
    onBeforeExport = defaultOnBeforeExport,
    copyStyles = true,
    nonce,
  }: ChartPrintExportOptions = {},
): Promise<void> {
  const printWindow = createExportIframe(fileName);
  const doc = ownerDocument(element);

  const printPromise = new Promise<void>((resolve, reject) => {
    printWindow.onload = () => {
      (async () => {
        const printDoc = printWindow.contentDocument!;
        const elementClone = element!.cloneNode(true) as Element;
        elementClone.querySelectorAll('[data-hide-on-export]').forEach((el) => el.remove());
        printDoc.body.replaceChildren(elementClone);
        printDoc.body.style.margin = '0px';

        const rootCandidate = element.getRootNode();
        const root =
          rootCandidate.constructor.name === 'ShadowRoot' ? (rootCandidate as ShadowRoot) : doc;

        if (copyStyles) {
          await Promise.all(loadStyleSheets(printDoc, root, nonce));
        }

        await copyCanvasesContent(element, elementClone);

        const mediaQueryList = printWindow.contentWindow!.matchMedia('print');
        mediaQueryList.addEventListener('change', (mql) => {
          const isAfterPrint = mql.matches === false;
          if (isAfterPrint) {
            printWindow.remove();
          }
        });

        await onBeforeExport(printWindow);

        printWindow.contentWindow!.print();
      })().then(resolve, reject);
    };
  });

  doc.body.appendChild(printWindow);

  return printPromise.catch((error) => {
    printWindow.remove();
    throw error;
  });
}

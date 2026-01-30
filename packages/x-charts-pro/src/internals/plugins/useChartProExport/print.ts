import ownerDocument from '@mui/utils/ownerDocument';
import { loadStyleSheets } from '@mui/x-internals/export';
import { copyCanvasesContent, createExportIframe } from './common';
import { type ChartPrintExportOptions } from './useChartProExport.types';
import { defaultOnBeforeExport } from './defaults';

export function printChart(
  element: Element,
  {
    fileName,
    onBeforeExport = defaultOnBeforeExport,
    copyStyles = true,
    nonce,
  }: ChartPrintExportOptions = {},
) {
  const printWindow = createExportIframe(fileName);
  const doc = ownerDocument(element);

  printWindow.onload = async () => {
    const printDoc = printWindow.contentDocument!;
    const elementClone = element!.cloneNode(true) as Element;
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
        doc.body.removeChild(printWindow);
      }
    });

    await onBeforeExport(printWindow);

    printWindow.contentWindow!.print();
  };

  doc.body.appendChild(printWindow);
}

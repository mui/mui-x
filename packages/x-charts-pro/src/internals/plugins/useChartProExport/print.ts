import ownerDocument from '@mui/utils/ownerDocument';
import { loadStyleSheets } from '@mui/x-internals/export';
import { createExportIframe } from './common';
import { ChartPrintExportOptions } from './useChartProExport.types';

export function printChart(
  element: HTMLElement | SVGElement,
  { fileName, onBeforeExport }: ChartPrintExportOptions = {},
) {
  const printWindow = createExportIframe(fileName);
  const doc = ownerDocument(element);

  printWindow.onload = async () => {
    const printDoc = printWindow.contentDocument!;
    const elementClone = element!.cloneNode(true) as HTMLElement | SVGElement;
    const container = document.createElement('div');
    container.appendChild(elementClone);
    printDoc.body.innerHTML = container.innerHTML;

    const rootCandidate = element.getRootNode();
    const root =
      rootCandidate.constructor.name === 'ShadowRoot' ? (rootCandidate as ShadowRoot) : doc;

    await Promise.all(loadStyleSheets(printDoc, root));

    const mediaQueryList = printWindow.contentWindow!.matchMedia('print');
    mediaQueryList.addEventListener('change', (mql) => {
      const isAfterPrint = mql.matches === false;
      if (isAfterPrint) {
        doc.body.removeChild(printWindow);
      }
    });

    await onBeforeExport?.(printWindow);

    printWindow.contentWindow!.print();
  };

  doc.body.appendChild(printWindow);
}

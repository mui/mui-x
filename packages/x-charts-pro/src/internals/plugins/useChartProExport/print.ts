import ownerDocument from '@mui/utils/ownerDocument';
import { createExportIframe, loadStyleSheets } from './common';
import { ChartPrintExportOptions } from './useChartProExport.types';

export function printChart(
  element: HTMLElement | SVGElement,
  { fileName }: ChartPrintExportOptions = {},
) {
  const printWindow = createExportIframe(fileName);
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

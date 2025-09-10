import ownerDocument from '@mui/utils/ownerDocument';
import { loadStyleSheets } from '@mui/x-internals/export';
import { applyStyles, createExportIframe } from './common';
import { ChartPrintExportOptions } from './useChartProExport.types';
import { defaultOnBeforeExport } from './defaults';

export function printChart(
  element: HTMLElement | SVGElement,
  svg: SVGElement,
  {
    fileName,
    onBeforeExport = defaultOnBeforeExport,
    copyStyles = true,
  }: ChartPrintExportOptions = {},
) {
  const printWindow = createExportIframe(fileName);
  const doc = ownerDocument(element);

  const svgSize = svg.getBoundingClientRect();
  /* We apply the min/max width and height to ensure the SVG doesn't resize in the export.
   * We apply to the original SVG so that the cloned tree will contain the styles and revert these
   * styles changes after the chart is cloned. */
  const previousStyles = applyStyles(svg, {
    'min-width': `${svgSize.width}px`,
    'max-width': `${svgSize.width}px`,
    height: `${svgSize.height}px`,
  });

  printWindow.onload = async () => {
    const printDoc = printWindow.contentDocument!;
    const elementClone = element!.cloneNode(true) as HTMLElement | SVGElement;
    applyStyles(svg, previousStyles);
    printDoc.body.replaceChildren(elementClone);
    printDoc.body.style.margin = '0px';

    const rootCandidate = element.getRootNode();
    const root =
      rootCandidate.constructor.name === 'ShadowRoot' ? (rootCandidate as ShadowRoot) : doc;

    if (copyStyles) {
      await Promise.all(loadStyleSheets(printDoc, root));
    }

    const mediaQueryList = printWindow.contentWindow!.matchMedia('print');
    mediaQueryList.addEventListener('change', (mql) => {
      const isAfterPrint = mql.matches === false;
      if (isAfterPrint) {
        doc.body.removeChild(printWindow);
      }
    });

    await onBeforeExport(printWindow);

    debugger;
    printWindow.contentWindow!.print();
  };

  doc.body.appendChild(printWindow);
}

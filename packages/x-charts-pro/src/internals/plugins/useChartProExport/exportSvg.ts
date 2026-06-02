import ownerDocument from '@mui/utils/ownerDocument';
import { type ChartSvgExportOptions } from './useChartProExport.types';

async function exportSvg(
  chartRoot: HTMLElement,
  chartContainer: HTMLElement | SVGSVGElement,
  options?: ChartSvgExportOptions,
) {
  const container = chartContainer.querySelector('svg');
  const clonedContainer = container?.cloneNode(true);
  if (!clonedContainer) {
    console.error(
      'MUI X Charts: No SVG element found in the chart container. Unable to export as SVG.',
    );
    return;
  }

  const rootCandidate = container?.getRootNode();
  const doc = ownerDocument(chartRoot);
  const root = rootCandidate instanceof ShadowRoot ? rootCandidate : doc;

  let css = '';

  for (const sheet of root.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        css += `${rule.cssText}\n`;
      }
    } catch {
      // cross-origin sheet — cssRules access throws; skip it
    }
  }

  const styleEl = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleEl.textContent = css;

  if (options?.nonce) {
    styleEl.setAttribute('nonce', options.nonce);
  }

  clonedContainer.insertBefore(styleEl, clonedContainer.firstChild);

  const svgString = new XMLSerializer().serializeToString(clonedContainer);

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = options?.fileName || `${document.title}.svg`;

  a.click();
  URL.revokeObjectURL(url);
}

export { exportSvg };

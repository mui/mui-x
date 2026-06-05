import ownerDocument from '@mui/utils/ownerDocument';
import { type ChartSvgExportOptions } from './useChartProExport.types';

async function exportSvg(
  chartRoot: Element,
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

  console.log({ root, chartRoot, rootCandidate });

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

  chartRoot.querySelectorAll('.MuiChartsLegend-series').forEach((seriesEle, i) => {
    const element = seriesEle.children[1] as HTMLElement;
    const markEl = seriesEle.children[0] as HTMLElement;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const textRect = element.getBoundingClientRect();

    const svgRect = container!.getBoundingClientRect();
    text.setAttribute('x', `${textRect.left - svgRect.left}`); // svg-local position
    text.setAttribute('y', `${seriesEle.getBoundingClientRect().top - svgRect.top}`); // Adjusting y to account for text height
    text.textContent = element.textContent || '';
    text.setAttribute('font-family', getComputedStyle(element).fontFamily);
    text.setAttribute('font-size', getComputedStyle(element).fontSize);

    clonedContainer.appendChild(text);
    const markRect = markEl.getBoundingClientRect();

    const markSvg = markEl.children[0].cloneNode(true) as SVGElement;
    markSvg.setAttribute('width', `${markRect.width}`);
    markSvg.setAttribute('height', `${markRect.height}`);
    markSvg.setAttribute('x', `${markRect.left - svgRect.left}`); // svg-local position
    markSvg.setAttribute('y', `${seriesEle.getBoundingClientRect().top - svgRect.top}`);
    clonedContainer.appendChild(markSvg);
  });

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

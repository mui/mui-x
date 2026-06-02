import { type ChartSvgExportOptions } from './useChartProExport.types';

function exportSvg(
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

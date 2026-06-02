import { type ChartSvgExportOptions } from './useChartProExport.types';

function exportSvg(chartRoot: HTMLElement, svg: SVGSVGElement, options?: ChartSvgExportOptions) {
  console.log('Exporting chart as SVG with options:', options);
}

export { exportSvg };

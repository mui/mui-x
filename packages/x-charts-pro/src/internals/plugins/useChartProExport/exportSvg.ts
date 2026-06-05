import ownerDocument from '@mui/utils/ownerDocument';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { triggerDownload } from './common';
import { type ChartSvgExportOptions } from './useChartProExport.types';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

type ExportLayer =
  | { kind: 'svg'; element: SVGSVGElement }
  | { kind: 'canvas'; element: HTMLCanvasElement };

/**
 * Classifies the chart container's child layers into the ones we can export.
 * SVG layers are kept as-is; canvas layers (e.g. the WebGL series) may be nested
 * inside a positioning wrapper, so we search non-SVG children for a `<canvas>`.
 */
function collectLayers(chartContainer: Element): ExportLayer[] {
  const layers: ExportLayer[] = [];
  for (const child of chartContainer.children) {
    if (child instanceof SVGSVGElement) {
      layers.push({ kind: 'svg', element: child });
    } else {
      const canvas = child instanceof HTMLCanvasElement ? child : child.querySelector('canvas');
      if (canvas) {
        layers.push({ kind: 'canvas', element: canvas });
      }
    }
  }
  return layers;
}

/**
 * Collects the CSS rules reachable from the given root into a single string.
 * Cross-origin stylesheets throw on `cssRules` access and are silently skipped.
 */
function collectCssText(root: Document | ShadowRoot): string {
  let css = '';
  for (const sheet of root.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        css += `${rule.cssText}\n`;
      }
    } catch {
      // Cross-origin stylesheet — `cssRules` access throws. Skip it.
    }
  }
  return css;
}

/**
 * Re-serializes the HTML legend as native SVG nodes (`<svg>` mark + `<text>` label),
 * positioned relative to the export origin. Returns a `<g>` containing all legend items,
 * or `null` when there is no legend.
 */
function buildLegendGroup(
  chartRoot: Element,
  doc: Document,
  originLeft: number,
  originTop: number,
): SVGElement | null {
  const seriesItems = chartRoot.querySelectorAll(`.${legendClasses.series}`);
  if (seriesItems.length === 0) {
    return null;
  }

  const group = doc.createElementNS(SVG_NS, 'g');

  seriesItems.forEach((seriesEl) => {
    const markEl = seriesEl.children[0] as HTMLElement | undefined;
    const labelEl = seriesEl.children[1] as HTMLElement | undefined;
    const seriesRect = seriesEl.getBoundingClientRect();

    // Marker: clone the rendered mark SVG and give it an explicit position/size,
    // since outside its wrapper `<div>` it no longer inherits CSS dimensions.
    const markSvg = markEl?.children[0]?.cloneNode(true) as SVGElement | undefined;
    if (markSvg && markEl) {
      const markRect = markEl.getBoundingClientRect();
      markSvg.setAttribute('x', `${markRect.left - originLeft}`);
      markSvg.setAttribute('y', `${markRect.top - originTop}`);
      markSvg.setAttribute('width', `${markRect.width}`);
      markSvg.setAttribute('height', `${markRect.height}`);
      group.appendChild(markSvg);
    }

    // Label: re-emit as `<text>`, vertically centered against the series item so it
    // aligns with the mark regardless of font size.
    if (labelEl) {
      const labelRect = labelEl.getBoundingClientRect();
      const labelStyles = getComputedStyle(labelEl);
      const text = doc.createElementNS(SVG_NS, 'text');
      text.textContent = labelEl.textContent || '';
      text.setAttribute('x', `${labelRect.left - originLeft}`);
      text.setAttribute('y', `${seriesRect.top - originTop + seriesRect.height / 2}`);
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('fill', labelStyles.color);
      text.setAttribute('font-family', labelStyles.fontFamily);
      text.setAttribute('font-size', labelStyles.fontSize);
      text.setAttribute('font-weight', labelStyles.fontWeight);
      group.appendChild(text);
    }
  });

  return group;
}

/**
 * Exports the chart as a standalone, self-contained SVG file.
 *
 * The chart can be composed of several stacked layers (e.g. an SVG grid, a WebGL/canvas
 * series layer, and an SVG axis layer). They are composited into a single output `<svg>`
 * in z-order: SVG layers are nested as-is and `<canvas>` layers are embedded as `<image>`.
 * The HTML legend is re-serialized as native SVG so it stays editable in design tools.
 */
function exportSvg(
  chartRoot: Element,
  chartContainer: HTMLElement | SVGSVGElement,
  options?: ChartSvgExportOptions,
) {
  const { fileName, nonce } = options ?? {};
  const doc = ownerDocument(chartRoot);

  const layers = collectLayers(chartContainer);

  if (layers.length === 0) {
    throw /* minify-error-disabled */ new Error(
      'MUI X Charts: No SVG or canvas layer found in the chart container.\n' +
        'This prevents the chart from being serialized to SVG.\n' +
        'Make sure the chart is rendered before calling `exportAsSvg`.',
    );
  }

  // The export must cover both the plot layers and the legend, which can sit on any side.
  // Use the union of their bounding boxes as the output canvas and the export origin.
  const legendEl = chartRoot.querySelector(`.${legendClasses.root}`);
  const rects = [chartContainer.getBoundingClientRect()];
  if (legendEl) {
    rects.push(legendEl.getBoundingClientRect());
  }
  const originLeft = Math.min(...rects.map((rect) => rect.left));
  const originTop = Math.min(...rects.map((rect) => rect.top));
  const width = Math.max(...rects.map((rect) => rect.right)) - originLeft;
  const height = Math.max(...rects.map((rect) => rect.bottom)) - originTop;

  const outSvg = doc.createElementNS(SVG_NS, 'svg');
  outSvg.setAttribute('xmlns', SVG_NS);
  outSvg.setAttribute('xmlns:xlink', XLINK_NS);
  outSvg.setAttribute('width', `${width}`);
  outSvg.setAttribute('height', `${height}`);
  outSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Inline the resolved page styles so the file renders standalone. Read from the chart's
  // own root (a ShadowRoot when the chart lives in shadow DOM, otherwise the document).
  const styleRoot = chartContainer.getRootNode();
  const styleEl = doc.createElementNS(SVG_NS, 'style');
  if (nonce) {
    styleEl.setAttribute('nonce', nonce);
  }
  styleEl.textContent = collectCssText(styleRoot instanceof ShadowRoot ? styleRoot : doc);
  outSvg.appendChild(styleEl);

  // Composite the plot layers in z-order (DOM order).
  layers.forEach((layer) => {
    const layerRect = layer.element.getBoundingClientRect();
    const x = layerRect.left - originLeft;
    const y = layerRect.top - originTop;

    if (layer.kind === 'canvas') {
      // Canvas/WebGL series can't be vectorized — embed as a raster `<image>`.
      const dataUrl = layer.element.toDataURL();
      const image = doc.createElementNS(SVG_NS, 'image');
      image.setAttribute('x', `${x}`);
      image.setAttribute('y', `${y}`);
      image.setAttribute('width', `${layerRect.width}`);
      image.setAttribute('height', `${layerRect.height}`);
      // Set both forms: `href` (SVG 2, browsers) and `xlink:href` (older renderers/editors).
      image.setAttribute('href', dataUrl);
      image.setAttributeNS(XLINK_NS, 'xlink:href', dataUrl);
      outSvg.appendChild(image);
    } else {
      // SVG layer — nest it, giving it an explicit position/size so it doesn't collapse.
      const clone = layer.element.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('x', `${x}`);
      clone.setAttribute('y', `${y}`);
      clone.setAttribute('width', `${layerRect.width}`);
      clone.setAttribute('height', `${layerRect.height}`);
      outSvg.appendChild(clone);
    }
  });

  // Re-serialize the HTML legend on top.
  const legendGroup = buildLegendGroup(chartRoot, doc, originLeft, originTop);
  if (legendGroup) {
    outSvg.appendChild(legendGroup);
  }

  const svgString = new XMLSerializer().serializeToString(outSvg);

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, fileName || `${document.title}.svg`);
  URL.revokeObjectURL(url);
}

export { exportSvg };

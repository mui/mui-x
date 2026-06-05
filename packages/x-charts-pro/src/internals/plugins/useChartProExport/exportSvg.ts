import ownerDocument from '@mui/utils/ownerDocument';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { triggerDownload } from './common';
import { type ChartSvgExportOptions } from './useChartProExport.types';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

type ExportLayer =
  | { kind: 'svg'; element: SVGSVGElement }
  | { kind: 'canvas'; element: HTMLCanvasElement };

function collectLayers(chartContainer: Element): ExportLayer[] {
  const layers: ExportLayer[] = [];
  for (const child of chartContainer.children) {
    if (child instanceof SVGSVGElement) {
      layers.push({ kind: 'svg', element: child });
    } else {
      /* Canvas layers (e.g. the WebGL series) can be nested inside a positioning wrapper,
       * so we look for a `<canvas>` inside non-SVG children. */
      const canvas = child instanceof HTMLCanvasElement ? child : child.querySelector('canvas');
      if (canvas) {
        layers.push({ kind: 'canvas', element: canvas });
      }
    }
  }
  return layers;
}

function collectCssText(root: Document | ShadowRoot): string {
  let css = '';
  for (const sheet of root.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        css += `${rule.cssText}\n`;
      }
    } catch {
      // Cross-origin stylesheets throw on `cssRules` access. Skip them.
    }
  }
  return css;
}

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

    /* Clone the rendered mark and give it an explicit position/size, since outside its
     * wrapper it no longer inherits dimensions from CSS. */
    const markSvg = markEl?.children[0]?.cloneNode(true) as SVGElement | undefined;
    if (markSvg && markEl) {
      const markRect = markEl.getBoundingClientRect();
      markSvg.setAttribute('x', `${markRect.left - originLeft}`);
      markSvg.setAttribute('y', `${markRect.top - originTop}`);
      markSvg.setAttribute('width', `${markRect.width}`);
      markSvg.setAttribute('height', `${markRect.height}`);
      group.appendChild(markSvg);
    }

    /* Re-emit the label as `<text>`, vertically centered on the item so it stays aligned
     * with the mark regardless of font size. */
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

async function exportSvg(
  chartRoot: Element,
  chartContainer: HTMLElement | SVGSVGElement,
  options?: ChartSvgExportOptions,
) {
  const { fileName, nonce, copyStyles = true, onBeforeExport } = options ?? {};
  const doc = ownerDocument(chartRoot);

  const layers = collectLayers(chartContainer);

  if (layers.length === 0) {
    throw /* minify-error-disabled */ new Error(
      'MUI X Charts: No SVG or canvas layer found in the chart container.\n' +
        'This prevents the chart from being serialized to SVG.\n' +
        'Make sure the chart is rendered before calling `exportAsSvg`.',
    );
  }

  /* The export must cover both the plot and the legend, which can sit on any side, so we use
   * the union of their bounding boxes as the output canvas and the export origin. */
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

  /* Inline the resolved page styles so the file renders standalone. Read from the chart's own
   * root, which is a ShadowRoot when the chart lives in shadow DOM, otherwise the document. */
  if (copyStyles) {
    const styleRoot = chartContainer.getRootNode();
    const styleEl = doc.createElementNS(SVG_NS, 'style');
    if (nonce) {
      styleEl.setAttribute('nonce', nonce);
    }
    styleEl.textContent = collectCssText(styleRoot instanceof ShadowRoot ? styleRoot : doc);
    outSvg.appendChild(styleEl);
  }

  // Composite the plot layers in z-order (DOM order).
  layers.forEach((layer) => {
    const layerRect = layer.element.getBoundingClientRect();
    const x = layerRect.left - originLeft;
    const y = layerRect.top - originTop;

    if (layer.kind === 'canvas') {
      /* Canvas/WebGL series can't be vectorized, so embed them as a raster `<image>`. We set both
       * `href` (SVG 2, browsers) and `xlink:href` (older renderers and design tools). */
      const dataUrl = layer.element.toDataURL();
      const image = doc.createElementNS(SVG_NS, 'image');
      image.setAttribute('x', `${x}`);
      image.setAttribute('y', `${y}`);
      image.setAttribute('width', `${layerRect.width}`);
      image.setAttribute('height', `${layerRect.height}`);
      image.setAttribute('href', dataUrl);
      image.setAttributeNS(XLINK_NS, 'xlink:href', dataUrl);
      outSvg.appendChild(image);
    } else {
      /* Nest the SVG layer, giving it an explicit position/size so the nested `<svg>` doesn't
       * collapse without the dimensions it used to inherit from CSS. */
      const clone = layer.element.cloneNode(true) as SVGSVGElement;
      clone.querySelectorAll('[data-hide-on-export]').forEach((el) => el.remove());
      clone.setAttribute('x', `${x}`);
      clone.setAttribute('y', `${y}`);
      clone.setAttribute('width', `${layerRect.width}`);
      clone.setAttribute('height', `${layerRect.height}`);
      outSvg.appendChild(clone);
    }
  });

  // Re-serialize the HTML legend as native SVG nodes on top of the plot.
  const legendGroup = buildLegendGroup(chartRoot, doc, originLeft, originTop);
  if (legendGroup) {
    outSvg.appendChild(legendGroup);
  }

  // Let consumers tweak the output SVG (add a title, watermark, etc.) before serialization.
  await onBeforeExport?.(outSvg);

  const svgString = new XMLSerializer().serializeToString(outSvg);

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, fileName || `${document.title}.svg`);
  URL.revokeObjectURL(url);
}

export { exportSvg };

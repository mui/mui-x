import ownerDocument from '@mui/utils/ownerDocument';
import { loadStyleSheets } from '@mui/x-internals/export';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { createExportIframe, triggerDownload } from './common';
import { type ChartSvgExportOptions } from './useChartProExport.types';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
// Temporary marker used to locate the chart container inside the cloned tree.
const CONTAINER_MARKER = 'data-mui-svg-export-container';
const LEGEND_TOP_PADDING = 16;

type ExportLayer =
  | { kind: 'svg'; element: SVGSVGElement }
  | { kind: 'canvas'; element: HTMLCanvasElement };

function collectLayers(chartContainer: Element): ExportLayer[] {
  const layers: ExportLayer[] = [];
  for (const child of chartContainer.children) {
    // Tag checks, not `instanceof`: these elements live in the iframe's document.
    if (child.matches('svg')) {
      layers.push({ kind: 'svg', element: child as SVGSVGElement });
    } else {
      // The canvas (e.g. WebGL series) can be nested inside a positioning wrapper.
      const canvas = child.matches('canvas')
        ? (child as HTMLCanvasElement)
        : child.querySelector('canvas');
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
  legendEl: Element,
  doc: Document,
  originLeft: number,
  originTop: number,
): SVGElement | null {
  const seriesItems = legendEl.querySelectorAll(`.${legendClasses.series}`);
  if (seriesItems.length === 0) {
    return null;
  }

  const view = legendEl.ownerDocument.defaultView ?? window;
  const group = doc.createElementNS(SVG_NS, 'g');

  seriesItems.forEach((seriesEl) => {
    const markEl = seriesEl.children[0] as HTMLElement | undefined;
    const labelEl = seriesEl.children[1] as HTMLElement | undefined;
    const seriesRect = seriesEl.getBoundingClientRect();

    // Clone the mark and give it an explicit position/size, since outside its wrapper it no
    // longer inherits dimensions from CSS.
    const markSvg = markEl?.children[0]?.cloneNode(true) as SVGElement | undefined;
    if (markSvg && markEl) {
      const markRect = markEl.getBoundingClientRect();
      markSvg.setAttribute('x', `${markRect.left - originLeft}`);
      markSvg.setAttribute('y', `${markRect.top - originTop}`);
      markSvg.setAttribute('width', `${markRect.width}`);
      markSvg.setAttribute('height', `${markRect.height}`);
      group.appendChild(markSvg);
    }

    // Re-emit the label as `<text>`, centered on the item so it stays aligned with the mark.
    if (labelEl) {
      const labelRect = labelEl.getBoundingClientRect();
      const labelStyles = view.getComputedStyle(labelEl);
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
  const styleRoot = chartContainer.getRootNode();
  const styleSource = styleRoot instanceof ShadowRoot ? styleRoot : doc;

  // Cloned canvases are blank, so capture the live bitmaps (in document order) before cloning.
  const canvasDataUrls = Array.from(chartContainer.querySelectorAll('canvas')).map((canvas) =>
    canvas.toDataURL(),
  );

  // Render into an isolated iframe forced to light mode so all styles resolve in light mode.
  const iframe = createExportIframe(fileName);
  const iframeLoaded = new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
  });
  doc.body.appendChild(iframe);
  await iframeLoaded;

  try {
    const exportDoc = iframe.contentDocument!;
    exportDoc.documentElement.setAttribute('data-mui-color-scheme', 'light');

    // Mark the live container so we can find its clone reliably (no class-name dependency).
    chartContainer.setAttribute(CONTAINER_MARKER, '');
    const chartClone = chartRoot.cloneNode(true) as Element;
    chartContainer.removeAttribute(CONTAINER_MARKER);

    chartClone.querySelectorAll('[data-hide-on-export]').forEach((el) => el.remove());
    exportDoc.body.replaceChildren(chartClone);
    exportDoc.body.style.margin = '0px';
    exportDoc.body.style.display = 'block';
    // The chart wrapper is `flex: 1`, so size the body to the live chart or the clone collapses.
    const rootRect = chartRoot.getBoundingClientRect();
    exportDoc.body.style.width = `${rootRect.width}px`;
    exportDoc.body.style.height = `${rootRect.height}px`;

    // Load the page styles into the iframe so the clone lays out and renders in light mode.
    await Promise.all(loadStyleSheets(exportDoc, styleSource, nonce));

    const containerClone = chartClone.querySelector(`[${CONTAINER_MARKER}]`);
    containerClone?.removeAttribute(CONTAINER_MARKER);
    const layers = containerClone ? collectLayers(containerClone) : [];

    if (!containerClone || layers.length === 0) {
      throw /* minify-error-disabled */ new Error(
        'MUI X Charts: No SVG or canvas layer found in the chart container.\n' +
          'This prevents the chart from being serialized to SVG.\n' +
          'Make sure the chart is rendered before calling `exportAsSvg`.',
      );
    }

    // Span the union of the plot and legend boxes; their top-left is the export origin.
    const legendClone = chartClone.querySelector(`.${legendClasses.root}`);
    const rects = [containerClone.getBoundingClientRect()];
    if (legendClone) {
      rects.push(legendClone.getBoundingClientRect());
    }
    const topPadding = legendClone ? LEGEND_TOP_PADDING : 0;
    const originLeft = Math.min(...rects.map((rect) => rect.left));
    const originTop = Math.min(...rects.map((rect) => rect.top)) - topPadding;
    const width = Math.max(...rects.map((rect) => rect.right)) - originLeft;
    const height = Math.max(...rects.map((rect) => rect.bottom)) - originTop;

    const outSvg = exportDoc.createElementNS(SVG_NS, 'svg');
    outSvg.setAttribute('xmlns', SVG_NS);
    outSvg.setAttribute('xmlns:xlink', XLINK_NS);
    outSvg.setAttribute('width', `${width}`);
    outSvg.setAttribute('height', `${height}`);
    outSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    outSvg.setAttribute('data-mui-color-scheme', 'light');

    if (copyStyles) {
      const styleEl = exportDoc.createElementNS(SVG_NS, 'style');
      if (nonce) {
        styleEl.setAttribute('nonce', nonce);
      }
      styleEl.textContent = collectCssText(styleSource);
      outSvg.appendChild(styleEl);
    }

    // Composite the plot layers in z-order (DOM order).
    let canvasIndex = 0;
    layers.forEach((layer) => {
      const layerRect = layer.element.getBoundingClientRect();
      const x = layerRect.left - originLeft;
      const y = layerRect.top - originTop;

      if (layer.kind === 'canvas') {
        // Canvas series can't be vectorized; embed the captured bitmap as an `<image>`.
        const dataUrl = canvasDataUrls[canvasIndex] ?? layer.element.toDataURL();
        canvasIndex += 1;
        const image = exportDoc.createElementNS(SVG_NS, 'image');
        image.setAttribute('x', `${x}`);
        image.setAttribute('y', `${y}`);
        image.setAttribute('width', `${layerRect.width}`);
        image.setAttribute('height', `${layerRect.height}`);
        // `href` for SVG 2/browsers, `xlink:href` for older renderers and design tools.
        image.setAttribute('href', dataUrl);
        image.setAttributeNS(XLINK_NS, 'xlink:href', dataUrl);
        outSvg.appendChild(image);
      } else {
        // Nest the SVG layer with an explicit position/size so it doesn't collapse.
        const clone = layer.element.cloneNode(true) as SVGSVGElement;
        clone.setAttribute('x', `${x}`);
        clone.setAttribute('y', `${y}`);
        clone.setAttribute('width', `${layerRect.width}`);
        clone.setAttribute('height', `${layerRect.height}`);
        outSvg.appendChild(clone);
      }
    });

    if (legendClone) {
      const legendGroup = buildLegendGroup(legendClone, exportDoc, originLeft, originTop);
      if (legendGroup) {
        outSvg.appendChild(legendGroup);
      }
    }

    await onBeforeExport?.(outSvg);

    const svgString = new XMLSerializer().serializeToString(outSvg);

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${fileName || document.title}.svg`);
    URL.revokeObjectURL(url);
  } finally {
    doc.body.removeChild(iframe);
  }
}

export { exportSvg };

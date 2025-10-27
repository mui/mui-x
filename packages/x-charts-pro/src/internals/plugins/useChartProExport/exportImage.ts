import ownerDocument from '@mui/utils/ownerDocument';
import { loadStyleSheets } from '@mui/x-internals/export';
import { applyStyles, createExportIframe } from './common';
import { ChartImageExportOptions } from './useChartProExport.types';
import { defaultOnBeforeExport } from './defaults';

export const getDrawDocument = async () => {
  try {
    const module = await import('rasterizehtml');

    return (module.default || module).drawDocument;
  } catch (error) {
    throw new Error(
      `MUI X Charts: Failed to import 'rasterizehtml' module. This dependency is mandatory when exporting a chart as an image. Make sure you have it installed as a dependency.`,
      { cause: error },
    );
  }
};

export async function exportImage(
  element: HTMLElement | SVGElement,
  svg: SVGElement,
  params?: ChartImageExportOptions,
) {
  const {
    fileName,
    type = 'image/png',
    quality = 0.9,
    onBeforeExport = defaultOnBeforeExport,
    copyStyles = true,
    nonce,
  } = params ?? {};
  const drawDocumentPromise = getDrawDocument();
  const doc = ownerDocument(element);

  const iframe = createExportIframe(fileName);
  /* We apply the min/max width and height to ensure the SVG doesn't resize in the export.
   * We apply to the original SVG so that the cloned tree will contain the styles and revert these
   * styles changes after the chart is cloned. */
  const previousStyles = applyStyles(svg, { width: `${svg.getBoundingClientRect().width}px` });

  let resolve: (value: void) => void;
  const iframeLoadPromise = new Promise((res) => {
    resolve = res;
  });

  iframe.nonce = nonce;
  iframe.onload = async () => {
    const exportDoc = iframe.contentDocument!;
    const elementClone = element.cloneNode(true) as HTMLElement;
    applyStyles(svg, previousStyles);
    exportDoc.body.replaceChildren(elementClone);
    exportDoc.body.style.margin = '0px';
    /* The body's parent has a width of 0, so we use fit-content to ensure that the body adjusts its width to the width
     * of its children. */
    exportDoc.body.style.width = 'fit-content';

    const rootCandidate = element.getRootNode();
    const root =
      rootCandidate.constructor.name === 'ShadowRoot' ? (rootCandidate as ShadowRoot) : doc;

    if (copyStyles) {
      await Promise.all(loadStyleSheets(exportDoc, root, nonce));
    }

    resolve();
  };

  doc.body.appendChild(iframe);

  await iframeLoadPromise;
  await onBeforeExport(iframe);

  const drawDocument = await drawDocumentPromise;

  /* Use the size from the export body in case `onBeforeExport` adds some elements that should be in the export. */
  const exportDocBodySize = iframe.contentDocument!.body.getBoundingClientRect();
  const canvas = document.createElement('canvas');
  const ratio = window.devicePixelRatio || 1;
  canvas.width = exportDocBodySize.width * ratio;
  canvas.height = exportDocBodySize.height * ratio;
  canvas.style.width = `${exportDocBodySize.width}px`;
  canvas.style.height = `${exportDocBodySize.height}px`;

  try {
    await drawDocument(iframe.contentDocument!, canvas, {
      // Handle retina displays: https://github.com/cburgmer/rasterizeHTML.js/blob/262b3404d1c469ce4a7750a2976dec09b8ae2d6c/examples/retina.html#L71
      zoom: ratio,
    });
  } finally {
    doc.body.removeChild(iframe);
  }

  let resolveBlobPromise: (value: Blob | null) => void;
  const blobPromise = new Promise<Blob | null>((res) => {
    resolveBlobPromise = res;
  });

  let blob: Blob | null;

  try {
    canvas.toBlob((b) => resolveBlobPromise(b), type, quality);
    blob = await blobPromise;
  } catch (error) {
    throw new Error('MUI X Charts: Failed to create blob from canvas.', { cause: error });
  }

  if (!blob) {
    throw new Error('MUI X Charts: Failed to create blob from canvas.');
  }

  const url = URL.createObjectURL(blob);

  triggerDownload(url, fileName || document.title);

  URL.revokeObjectURL(url);
}

function triggerDownload(url: string, name: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

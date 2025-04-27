import ownerDocument from '@mui/utils/ownerDocument';
import { createExportIframe, loadStyleSheets } from './common';
import { ChartImageExportOptions } from './useChartProExport.types';

export const getDrawDocument = async () => {
  try {
    const module = await import('rasterizehtml');

    return module.drawDocument;
  } catch (error) {
    throw new Error(
      `MUI X: Failed to import 'rasterizehtml' module. This dependency is mandatory when exporting a chart as an image. Make sure you have it installed as a dependency.`,
      { cause: error },
    );
  }
};

export async function exportImage(
  element: HTMLElement | SVGElement,
  params?: ChartImageExportOptions,
) {
  const { fileName, type = 'image/png', quality = 0.9 } = params ?? {};
  const drawDocumentPromise = getDrawDocument();
  const { width, height } = element.getBoundingClientRect();
  const doc = ownerDocument(element);
  const canvas = document.createElement('canvas');
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const iframe = createExportIframe(fileName);

  let resolve: (value: void) => void;
  const iframeLoadPromise = new Promise((res) => {
    resolve = res;
  });

  iframe.onload = async () => {
    const exportDoc = iframe.contentDocument!;
    const elementClone = element.cloneNode(true) as HTMLElement;
    const container = document.createElement('div');
    container.appendChild(elementClone);
    exportDoc.body.innerHTML = container.innerHTML;
    exportDoc.body.style.margin = '0px';

    await loadStyleSheets(exportDoc, element);

    resolve();
  };

  doc.body.appendChild(iframe);

  const [drawDocument] = await Promise.all([drawDocumentPromise, iframeLoadPromise]);

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
  canvas.toBlob((blob) => resolveBlobPromise(blob), type, quality);

  let blob: Blob | null;

  try {
    blob = await blobPromise;
  } catch (error) {
    throw new Error('MUI X: Failed to create blob from canvas.', { cause: error });
  }

  if (!blob) {
    throw new Error('MUI X: Failed to create blob from canvas.');
    return;
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

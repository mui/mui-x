/**
 * RasterizeHTML implementation
 * Renders HTML documents to canvas
 */

import { inlineReferences } from './inlineresources';

interface DrawDocumentOptions {
  zoom?: number;
  executeJs?: boolean;
  executeJsTimeout?: number;
  width?: number;
  height?: number;
  nonce?: string;
}

interface DrawDocumentResult {
  image: HTMLCanvasElement;
  errors: Array<{
    resourceType: string;
    url?: string;
    msg: string;
  }>;
}

/**
 * Serialize an HTML document to a string
 */
function documentToSVG(doc: Document): string {
  const doctype = doc.doctype ? `<!DOCTYPE ${doc.doctype.name}>` : '<!DOCTYPE html>';

  return doctype + doc.documentElement.outerHTML;
}

/**
 * Draw an HTML document to a canvas
 */
export async function drawDocument(
  doc: Document,
  canvas: HTMLCanvasElement,
  options: DrawDocumentOptions = {},
): Promise<DrawDocumentResult> {
  const { zoom = 1, nonce } = options;

  const clonedDoc = doc;
  /// / Clone the document to avoid modifying the original
  // const clonedDoc = doc.cloneNode(true) as Document;

  /// / Inline all external resources
  // const errors = await inlineReferences(clonedDoc, { nonce });

  // Get the dimensions
  const docElement = clonedDoc.documentElement;
  const body = clonedDoc.body;

  // Calculate dimensions
  let width = options.width || body?.scrollWidth || docElement?.scrollWidth || 300;
  let height = options.height || body?.scrollHeight || docElement?.scrollHeight || 150;

  // Apply zoom
  width *= zoom;
  height *= zoom;

  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;

  // Serialize the document to HTML
  const htmlString = documentToSVG(clonedDoc);

  // Create an SVG with embedded HTML
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        ${htmlString}
      </foreignObject>
    </svg>
  `;

  // Create a blob and object URL
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    // Load the SVG as an image
    await new Promise<void>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D context from canvas'));
          return;
        }

        // Clear the canvas
        ctx.clearRect(0, 0, width, height);

        // Apply zoom transform
        if (zoom !== 1) {
          ctx.scale(zoom, zoom);
        }

        // Draw the image
        ctx.drawImage(img, 0, 0, width / zoom, height / zoom);

        resolve();
      };

      img.onerror = (_event, _source, _lineno, _colno, error) => {
        reject(new Error('Failed to load SVG image', { cause: error }));
      };

      img.src = url;
    });
  } finally {
    // Clean up the object URL
    URL.revokeObjectURL(url);
  }

  return {
    image: canvas,
    errors: [],
  };
}

/**
 * Alternative implementation using canvas drawImage directly from the document
 * This is more compatible but may have limitations with complex CSS
 */
export async function drawDocumentDirect(
  doc: Document,
  canvas: HTMLCanvasElement,
  options: DrawDocumentOptions = {},
): Promise<DrawDocumentResult> {
  const { zoom = 1, nonce } = options;

  // Clone the document
  const clonedDoc = doc.cloneNode(true) as Document;

  // Inline all external resources
  const errors = await inlineReferences(clonedDoc, { nonce });

  // Get dimensions from the document
  const body = clonedDoc.body;
  const docElement = clonedDoc.documentElement;

  const width = options.width || body?.scrollWidth || docElement?.scrollWidth || 300;
  const height = options.height || body?.scrollHeight || docElement?.scrollHeight || 150;

  // Set canvas size with zoom
  canvas.width = width * zoom;
  canvas.height = height * zoom;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context from canvas');
  }

  // Scale for zoom
  if (zoom !== 1) {
    ctx.scale(zoom, zoom);
  }

  const xmlSerializer = new XMLSerializer();

  // Create SVG with foreignObject
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
          ${xmlSerializer.serializeToString(doc)}
      </foreignObject>
    </svg>
  `;

  const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);
  const oldSchoolUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

  try {
    await new Promise<void>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        resolve();
      };

      img.onerror = (_event, _source, _lineno, _colno, error) => {
        reject(new Error('Failed to render document to canvas', { cause: error }));
      };

      img.src = oldSchoolUrl;
    });
  } finally {
    URL.revokeObjectURL(url);
  }

  return {
    image: canvas,
    errors,
  };
}

/**
 * Main export matching rasterizeHTML.js API
 */
export default {
  drawDocument,
  drawDocumentDirect,
};

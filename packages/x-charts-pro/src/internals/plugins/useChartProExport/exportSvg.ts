import { ChartImageExportOptions } from './useChartProExport.types';
import { defaultOnBeforeExport } from './defaults';
import { createExportIframe } from './common';

function triggerDownload(url: string, name: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

export async function exportSvg(
  element: HTMLElement | SVGElement,
  params?: ChartImageExportOptions,
) {
  const {
    fileName,
    onBeforeExport = defaultOnBeforeExport,
    copyStyles = true,
  } = params ?? {};

  // Find the SVG element within the chart
  let svgElement: SVGElement | null = null;

  if (element.tagName.toLowerCase() === 'svg') {
    svgElement = element as SVGElement;
  } else {
    // First try to find the main chart SVG by class (ChartsSurface component)
    svgElement = element.querySelector('svg.MuiChartsSurface-root');
    
    // If not found, try to find SVG with title element (ChartsSurface adds title/desc)
    if (!svgElement) {
      const titleElement = element.querySelector('svg title');
      if (titleElement) {
        svgElement = titleElement.parentElement as SVGElement;
      }
    }
    
    // Final fallback to the first SVG (for backward compatibility)
    if (!svgElement) {
      svgElement = element.querySelector('svg');
    }
  }

  if (!svgElement) {
    throw new Error('MUI X Charts: No SVG element found in the chart for SVG export.');
  }

  // Create iframe for consistent style handling
  const iframe = createExportIframe(fileName);
  
  let resolve: (value: void) => void;
  const iframeLoadPromise = new Promise((res) => {
    resolve = res;
  });

  iframe.onload = async () => {
    const exportDoc = iframe.contentDocument!;
    
    // Clone the SVG element
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    
    // Set up the document structure
    const container = document.createElement('div');
    container.appendChild(svgClone);
    exportDoc.body.innerHTML = container.innerHTML;
    exportDoc.body.style.margin = '0px';

    const rootCandidate = element.getRootNode();
    const root = rootCandidate.constructor.name === 'ShadowRoot' 
      ? (rootCandidate as ShadowRoot) 
      : document;

    if (copyStyles) {
      // Import loadStyleSheets if needed for consistent styling
      try {
        const { loadStyleSheets } = await import('@mui/x-internals/export');
        await Promise.all(loadStyleSheets(exportDoc, root));
      } catch (error) {
        console.warn('MUI X Charts: Could not load stylesheets for SVG export:', error);
      }
    }

    resolve();
  };

  document.body.appendChild(iframe);

  await iframeLoadPromise;
  await onBeforeExport(iframe);

  try {
    // Get the processed SVG from the iframe
    const processedSvg = iframe.contentDocument!.querySelector('svg');
    
    if (!processedSvg) {
      throw new Error('MUI X Charts: Processed SVG element not found.');
    }

    // Clean up and serialize the SVG
    const svgString = new XMLSerializer().serializeToString(processedSvg);
    
    // Add XML declaration and ensure proper namespace
    const fullSvgContent = `<?xml version="1.0" encoding="UTF-8"?>\n${svgString}`;
    
    // Create blob with SVG content
    const blob = new Blob([fullSvgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const downloadFileName = fileName || document.title;
    const fileNameWithExtension = downloadFileName.endsWith('.svg') 
      ? downloadFileName 
      : `${downloadFileName}.svg`;
    
    triggerDownload(url, fileNameWithExtension);
    URL.revokeObjectURL(url);
    
  } finally {
    document.body.removeChild(iframe);
  }
}
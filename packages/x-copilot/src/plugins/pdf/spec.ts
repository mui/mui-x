/**
 * Minimal types describing the json-render @react-pdf Spec shape the model
 * emits as `composePdfReport` input. We don't import `@json-render/core` types
 * here because that package is dynamic-imported (peer/optional) at runtime.
 */
export interface PdfReportSpecElement {
  type: string;
  props?: Record<string, unknown>;
  children?: string[];
  repeat?: { statePath: string; key?: string };
}

export interface PdfReportSpec {
  root: string;
  elements: Record<string, PdfReportSpecElement>;
}

export interface PdfReportToolInput {
  tree: PdfReportSpec;
}

/**
 * Read the document title from a spec by looking at the root element's
 * `props.title` (Document is the conventional root for PDF reports).
 */
export function extractPdfReportTitle(tree: PdfReportSpec | undefined | null): string | undefined {
  if (!tree || typeof tree !== 'object') {
    return undefined;
  }
  const rootElement = tree.elements?.[tree.root];
  const title = rootElement?.props?.title;
  if (typeof title === 'string' && title.trim() !== '') {
    return title;
  }
  return undefined;
}

/**
 * Counts the number of `Page` elements in a spec. Cheap proxy for page count.
 */
export function countPdfReportPages(tree: PdfReportSpec | undefined | null): number {
  if (!tree?.elements) {
    return 0;
  }
  return Object.values(tree.elements).filter((el) => el?.type === 'Page').length;
}

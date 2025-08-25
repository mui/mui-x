export const imageMimeTypes: Record<string, string | undefined> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/webp': 'WebP',
  'image/svg+xml': 'SVG',
};

export type ChartImageExportMimeType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/svg+xml';

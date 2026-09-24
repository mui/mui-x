import type { ChartExcelTableId } from './chartExcelData.types';

const MAX_SHEET_NAME_LENGTH = 31;
const FORBIDDEN_CHARACTERS = /[\\/?*[\]:]/g;

export const DEFAULT_SHEET_NAMES: Record<ChartExcelTableId, string> = {
  category: 'category',
  scatter: 'scatter',
  pie: 'pie',
  funnel: 'funnel',
  heatmap: 'heatmap',
  rangeBar: 'rangeBar',
  ohlc: 'ohlc',
  mapShape: 'mapShape',
  sankeyNodes: 'sankey.nodes',
  sankeyLinks: 'sankey.links',
};

/**
 * Makes a sheet name Excel accepts, and unique within the workbook.
 * Excel compares sheet names case-insensitively, so deduplication does too.
 */
export function sanitizeSheetName(name: string, used: Set<string>): string {
  let base = name.replace(FORBIDDEN_CHARACTERS, '_').replace(/^'+|'+$/g, '');

  if (base.length === 0) {
    base = 'Sheet';
  }
  base = base.slice(0, MAX_SHEET_NAME_LENGTH);

  if (!used.has(base.toLowerCase())) {
    used.add(base.toLowerCase());
    return base;
  }

  for (let index = 2; ; index += 1) {
    const suffix = ` (${index})`;
    const candidate = base.slice(0, MAX_SHEET_NAME_LENGTH - suffix.length) + suffix;
    if (!used.has(candidate.toLowerCase())) {
      used.add(candidate.toLowerCase());
      return candidate;
    }
  }
}

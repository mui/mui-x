import type { ChartExcelCellValue } from './chartExcelData.types';

const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

/**
 * Coerces a series value into something exceljs writes natively.
 * Numbers and dates are passed through so Excel formats them itself.
 */
export function toCell(value: unknown): ChartExcelCellValue {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number' || typeof value === 'boolean' || value instanceof Date) {
    return value;
  }
  if (typeof value === 'string') {
    return value;
  }
  return String(value);
}

/**
 * Prefixes text Excel would otherwise evaluate as a formula.
 * Mirrors the Data Grid's Excel serializer.
 */
export function escapeFormula(value: ChartExcelCellValue): ChartExcelCellValue {
  if (typeof value !== 'string' || value.length === 0) {
    return value;
  }
  return FORMULA_PREFIXES.includes(value[0]) ? `'${value}` : value;
}

export function toSafeCell(value: unknown, escape: boolean): ChartExcelCellValue {
  const cell = toCell(value);
  return escape ? escapeFormula(cell) : cell;
}

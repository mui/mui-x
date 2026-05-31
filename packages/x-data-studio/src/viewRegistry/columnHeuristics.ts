import type { GridColDef } from '@mui/x-data-grid';

/**
 * Heuristics for guessing which columns make good chart/dashboard dimensions
 * (categories) vs measures (numbers). Used by the built-in chart + dashboard
 * views to seed sensible defaults from a Data Source's columns.
 */

/**
 * Is this column an identifier (its field/header reads like an `id` or `key`)?
 * Identifier columns are high-cardinality and make poor categories/measures.
 */
export function isIdLikeColumn(column: GridColDef): boolean {
  const haystack = `${column.field} ${column.headerName ?? ''}`.toLowerCase();
  return /(^|[^a-z])id([^a-z]|$)|id$|key$/.test(haystack);
}

/**
 * Is this column date/time-like (by type or name)? Dates are high-cardinality,
 * so a poor default category.
 */
export function isDateLikeColumn(column: GridColDef): boolean {
  if (column.type === 'date' || column.type === 'dateTime') {
    return true;
  }
  const haystack = `${column.field} ${column.headerName ?? ''}`.toLowerCase();
  return /\b(date|time|timestamp|datetime)\b|date$|_at$/.test(haystack);
}

/** Numeric measure columns (excludes the row-id column + id-like columns). */
export function pickMeasureColumns(
  columns: readonly GridColDef[],
  idField: string,
): GridColDef[] {
  return columns.filter(
    (column) => column.type === 'number' && column.field !== idField && !isIdLikeColumn(column),
  );
}

/** Categorical columns eligible to be a grouping dimension. */
export function pickDimensionColumns(
  columns: readonly GridColDef[],
  idField: string,
): GridColDef[] {
  return columns.filter(
    (column) =>
      column.field !== idField &&
      column.type !== 'number' &&
      !isIdLikeColumn(column) &&
      !isDateLikeColumn(column),
  );
}

/**
 * Does this column's name read like a free-text / high-cardinality field (a name,
 * email, address, etc.)? Used to avoid auto-picking such columns as the default
 * chart category when there's no row data to measure cardinality (server sources).
 */
export function isHighCardinalityLikeColumn(column: GridColDef): boolean {
  const haystack = `${column.field} ${column.headerName ?? ''}`.toLowerCase();
  return /\b(name|email|e-mail|address|phone|description|notes?|comment|title|url|street|zip|postal|first|last|full ?name|username)\b/.test(
    haystack,
  );
}

/**
 * Choose the best default grouping dimension: the eligible categorical column with
 * the fewest distinct values when row data is available; otherwise (e.g. a server
 * source with no local rows) the first eligible categorical that doesn't *look*
 * high-cardinality by name, so a chart doesn't open with hundreds of bars.
 */
export function pickBestDimension(
  columns: readonly GridColDef[],
  idField: string,
  rows: ReadonlyArray<Record<string, unknown>> | undefined,
): string | null {
  const candidates = pickDimensionColumns(columns, idField);
  if (candidates.length === 0) {
    return null;
  }
  if (rows && rows.length > 0 && candidates.length > 1) {
    let best = candidates[0].field;
    let bestCardinality = Infinity;
    for (const candidate of candidates) {
      const cardinality = new Set(rows.map((row) => row[candidate.field])).size;
      if (cardinality > 1 && cardinality < bestCardinality) {
        bestCardinality = cardinality;
        best = candidate.field;
      }
    }
    return best;
  }
  // No row data: prefer a column that doesn't read as free-text / high-cardinality.
  const lowCardinality = candidates.find((candidate) => !isHighCardinalityLikeColumn(candidate));
  return (lowCardinality ?? candidates[0]).field;
}

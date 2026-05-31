import type { GridRowModel } from '@mui/x-data-grid';
import type {
  FormulaDataSource,
  FormulaRowId,
  FormulaScope,
  FormulaValue,
} from '@mui/x-copilot';
import type { StudioCopilotApi } from '../studioHostAdapter';

function pickRowId(row: GridRowModel, idField?: string): FormulaRowId | undefined {
  if (idField && row[idField] != null) {
    const v = row[idField];
    return typeof v === 'string' || typeof v === 'number' ? v : String(v);
  }
  if (row.id != null) {
    const v = row.id;
    return typeof v === 'string' || typeof v === 'number' ? v : String(v);
  }
  return undefined;
}

function coerceCellValue(raw: unknown): FormulaValue {
  if (raw === null || raw === undefined) {
    return null;
  }
  if (typeof raw === 'number' || typeof raw === 'string' || typeof raw === 'boolean') {
    return raw;
  }
  if (typeof raw === 'object' && raw instanceof Date) {
    return raw.getTime();
  }
  return String(raw);
}

/**
 * Build a `FormulaDataSource` view over the currently active Studio dataSource.
 *
 * v1 limitation: only the dataSource's **static `rows`** are visible to the
 * formula engine. Data-source-backed dataSources (server-fed) don't expose a
 * synchronous full-rows view today; the engine returns an empty row set in
 * that case. A future revision can read from the live `sessionCache`.
 */
export function createStudioFormulaDataSource(
  api: StudioCopilotApi,
  _scope: FormulaScope,
): FormulaDataSource {
  const activeDataSource = api.stateApi.activeDataSource;
  const rows: ReadonlyArray<GridRowModel> = Array.isArray(activeDataSource?.rows)
    ? (activeDataSource!.rows as ReadonlyArray<GridRowModel>)
    : [];
  const idField = activeDataSource?.rowIdField;
  const columns = activeDataSource?.columns ?? [];
  const columnSet = new Set(columns.map((col) => col.field));
  const rowById = new Map<FormulaRowId, GridRowModel>();
  const rowIds: FormulaRowId[] = [];
  rows.forEach((row, index) => {
    const id = pickRowId(row, idField) ?? index;
    if (!rowById.has(id)) {
      rowById.set(id, row);
      rowIds.push(id);
    }
  });

  return {
    getRowIds() {
      // Studio doesn't yet maintain a separate "filtered" projection at the
      // copilot layer — return the full row set for both scopes. Hosts can
      // refine this once filter state is mirrored in the state document.
      return rowIds;
    },
    hasColumn(field: string) {
      return columnSet.has(field);
    },
    getCellValue(rowId: FormulaRowId, field: string) {
      const row = rowById.get(rowId);
      if (!row) {
        return null;
      }
      return coerceCellValue(row[field]);
    },
  };
}

import type { GridInitialState } from '@mui/x-data-grid';
import type { DataStudioDataSource, DataStudioSheet } from '../DataStudio/DataStudio.types';
import type { DataStudioStateApi } from '../DataStudio/useDataStudioState';

/**
 * Normalized representation of a DataStudio sheet as it appears in the copilot
 * state document. `initialState` defaults to an empty object so the agent can
 * patch sub-paths without first creating the slot.
 */
export interface SheetDoc {
  id: string;
  label: string;
  dataSourceId: string | null;
  initialState: GridInitialState;
}

export interface DataSourceDoc {
  id: string;
  label: string;
}

export interface StudioStateDocument {
  active: {
    dataSourceId: string | null;
    sheetId: string | null;
  };
  dataSources: DataSourceDoc[];
  /**
   * Sheets keyed by id so `/sheets/<id>/...` paths can be addressed by the
   * agent via plain JSON Patch (which has no ID-lookup for arrays).
   */
  sheets: Record<string, SheetDoc>;
  /** Display order. Mutated by sheet CRUD commands, not by direct patches. */
  sheetOrder: string[];
}

function labelToString(label: unknown): string {
  return typeof label === 'string' ? label : String(label ?? '');
}

function normalizeSheet(sheet: DataStudioSheet): SheetDoc {
  return {
    id: sheet.id,
    label: labelToString(sheet.label),
    dataSourceId: sheet.dataSourceId,
    initialState: sheet.initialState ?? {},
  };
}

function normalizeDataSource(dataSource: DataStudioDataSource): DataSourceDoc {
  return {
    id: dataSource.id,
    label: labelToString(dataSource.label),
  };
}

/**
 * Snapshot the current Studio state into a serializable document the copilot
 * executor can operate on.
 */
export function snapshotState(
  stateApi: DataStudioStateApi<any>,
  dataSources: ReadonlyArray<DataStudioDataSource<any>>,
): StudioStateDocument {
  const sheets: Record<string, SheetDoc> = {};
  const sheetOrder: string[] = [];
  stateApi.sheets.forEach((sheet) => {
    const normalized = normalizeSheet(sheet);
    sheets[normalized.id] = normalized;
    sheetOrder.push(normalized.id);
  });
  return {
    active: {
      dataSourceId: stateApi.activeDataSourceId || null,
      sheetId: stateApi.activeSheetId,
    },
    dataSources: dataSources.map(normalizeDataSource),
    sheets,
    sheetOrder,
  };
}

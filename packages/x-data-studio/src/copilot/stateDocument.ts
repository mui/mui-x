import type { GridColDef, GridInitialState } from '@mui/x-data-grid';
import type {
  DataStudioDataSource,
  DataStudioJointSourceConfig,
  DataStudioSheet,
} from '../DataStudio/DataStudio.types';
import type { DataStudioJoinDefinition } from '../models';
import type { DataStudioStateApi } from '../DataStudio/useDataStudioState';

/**
 * Normalized representation of a DataStudio sheet as it appears in the copilot
 * state document. `initialState` and `params` default to empty objects so the
 * agent can patch sub-paths without first creating the slot. `type` is the view
 * renderer key (`'grid'` | `'spreadsheet'` | `'pivot'` | `'chart'` | `'dashboard'`
 * | custom); `params` holds the type-specific config (e.g. a chart summary or a
 * pivot model) that the agent reads + patches at `/sheets/<id>/params`.
 */
export interface SheetDoc {
  id: string;
  label: string;
  dataSourceId: string | null;
  type: string;
  initialState: GridInitialState;
  params: Record<string, unknown>;
}

/** A column of a data source, surfaced so the agent can pick fields data-aware. */
export interface DataSourceColumnDoc {
  field: string;
  type?: string;
  headerName?: string;
}

export interface DataSourceDoc {
  id: string;
  label: string;
  columns: DataSourceColumnDoc[];
  /**
   * Whether the connector groups/aggregates server-side (so the agent can
   * choose to group/aggregate the whole dataset).
   */
  supportsServerGrouping?: boolean;
  /**
   * Opaque token shared by data sources that can be joined together. Data
   * sources with the same `joinGroup` can be combined into a joint source.
   */
  joinGroup?: string;
}

/**
 * A user-authored joint source: a declarative JOIN of base data sources. The
 * agent can create/update/delete these via the `studio.*JointSource` commands.
 */
export interface JointSourceDoc {
  id: string;
  label: string;
  definition: DataStudioJoinDefinition;
}

/**
 * The copilot state document sent to the backend each turn (under
 * `studioContext.state`). This is the source-of-truth shape.
 *
 * ⚠️ CONTRACT: the backend `StudioStateDocumentSchema` (brussels:
 * `apps/mui-backend/src/copilot/clients/data-studio/protocol/state-document.ts`)
 * must mirror this exactly — the route validates `studioContext` and returns
 * 400 on any mismatch. Changes here require a matching change there (+ a
 * `version` bump in the backend `context.ts`/`catalog.ts`). The golden shape is
 * pinned in `__tests__/stateDocument.test.ts`.
 */
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
  /**
   * User-authored joint sources (declarative JOINs of base data sources).
   * Managed via the `studio.createJointSource` / `updateJointSource` /
   * `deleteJointSource` commands — never via direct patches.
   */
  jointSources: JointSourceDoc[];
}

function labelToString(label: unknown): string {
  return typeof label === 'string' ? label : String(label ?? '');
}

function normalizeColumn(column: GridColDef): DataSourceColumnDoc {
  return {
    field: column.field,
    ...(column.type ? { type: column.type } : {}),
    ...(column.headerName ? { headerName: column.headerName } : {}),
  };
}

function normalizeSheet(sheet: DataStudioSheet): SheetDoc {
  return {
    id: sheet.id,
    label: labelToString(sheet.label),
    dataSourceId: sheet.dataSourceId,
    type: sheet.type ?? 'grid',
    initialState: sheet.initialState ?? {},
    params: sheet.params ?? {},
  };
}

function normalizeDataSource(dataSource: DataStudioDataSource): DataSourceDoc {
  return {
    id: dataSource.id,
    label: labelToString(dataSource.label),
    columns: (dataSource.columns ?? []).map(normalizeColumn),
    ...(dataSource.supportsServerGrouping
      ? { supportsServerGrouping: dataSource.supportsServerGrouping }
      : {}),
    ...(dataSource.joinGroup ? { joinGroup: dataSource.joinGroup } : {}),
  };
}

/**
 * Snapshot the current Studio state into a serializable document the copilot
 * executor can operate on.
 */
export function snapshotState(
  stateApi: DataStudioStateApi<any>,
  dataSources: ReadonlyArray<DataStudioDataSource<any>>,
  jointConfigs: ReadonlyArray<DataStudioJointSourceConfig> = [],
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
    jointSources: jointConfigs.map((config) => ({
      id: config.id,
      label: config.label,
      definition: config.definition,
    })),
  };
}

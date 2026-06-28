import type { GridRowModel } from '@mui/x-data-grid';
import type { HostDataQueryProvider } from '@mui/x-copilot';
import type { DataStudioDataSource } from '../../DataStudio/DataStudio.types';
import {
  QUERY_STUDIO_DATA_TOOL_NAME,
  type StudioDataQueryColumnMeta,
  type StudioDataQueryInput,
  type StudioDataQueryResult,
} from './types';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

function findDataSource(
  dataSources: ReadonlyArray<DataStudioDataSource<any>>,
  dataSourceId: string,
): DataStudioDataSource<any> | undefined {
  return dataSources.find((d) => d.id === dataSourceId);
}

function projectColumns(
  dataSource: DataStudioDataSource<any>,
): ReadonlyArray<StudioDataQueryColumnMeta> {
  return (dataSource.columns ?? []).map((col) => ({
    field: col.field,
    headerName: typeof col.headerName === 'string' ? col.headerName : undefined,
  }));
}

function projectRows(
  dataSource: DataStudioDataSource<any>,
  limit: number,
): ReadonlyArray<GridRowModel> {
  const raw = Array.isArray(dataSource.rows) ? (dataSource.rows as ReadonlyArray<GridRowModel>) : [];
  if (raw.length <= limit) {
    return raw;
  }
  return raw.slice(0, limit);
}

/**
 * Build a `HostDataQueryProvider` that responds to `queryStudioData` calls
 * by reading from the active studio's static dataSource rows. Data-source-backed
 * dataSources return an empty row set today; full async query support is a
 * follow-up.
 */
export function createQueryStudioDataProvider(
  dataSources: () => ReadonlyArray<DataStudioDataSource<any>>,
): HostDataQueryProvider<StudioDataQueryInput, StudioDataQueryResult> {
  return {
    toolNames: [QUERY_STUDIO_DATA_TOOL_NAME],

    validateInput(raw) {
      if (!raw || typeof raw !== 'object') {
        return { ok: false, reason: 'queryStudioData input must be an object' };
      }
      const candidate = raw as Partial<StudioDataQueryInput>;
      if (typeof candidate.dataSourceId !== 'string' || candidate.dataSourceId.trim() === '') {
        return { ok: false, reason: 'queryStudioData requires { dataSourceId: string }' };
      }
      if (candidate.limit != null && (!Number.isFinite(candidate.limit) || candidate.limit < 0)) {
        return { ok: false, reason: 'queryStudioData.limit must be a non-negative number' };
      }
      const exists = findDataSource(dataSources(), candidate.dataSourceId);
      if (!exists) {
        return { ok: false, reason: `queryStudioData: unknown dataSourceId '${candidate.dataSourceId}'` };
      }
      return { ok: true, input: { dataSourceId: candidate.dataSourceId, limit: candidate.limit } };
    },

    preview(input) {
      const dataSource = findDataSource(dataSources(), input.dataSourceId);
      if (!dataSource) {
        return { meta: { dataSourceId: input.dataSourceId, rowCount: 0, columns: [] } };
      }
      const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
      const rows = projectRows(dataSource, limit);
      return {
        meta: {
          dataSourceId: dataSource.id,
          rowCount: rows.length,
          columns: projectColumns(dataSource),
        },
      };
    },

    execute(input) {
      const dataSource = findDataSource(dataSources(), input.dataSourceId);
      if (!dataSource) {
        return {
          meta: { dataSourceId: input.dataSourceId, rowCount: 0, columns: [] },
          rows: [],
        };
      }
      const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
      const rows = projectRows(dataSource, limit);
      return {
        meta: {
          dataSourceId: dataSource.id,
          rowCount: rows.length,
          columns: projectColumns(dataSource),
        },
        rows,
      };
    },

    redactForBackend(result, _toolCallId) {
      // Send shape + counts only; rows stay on the client for plugin
      // resolution (PDF templating, formula evaluation).
      return {
        meta: result.meta,
      };
    },

    hydrateFromMessage(_parts) {
      // v1: no hydration — full async + persisted-result restore lands once
      // x-copilot extracts the approval-aware streaming layer.
      return new Map<string, StudioDataQueryResult>();
    },
  };
}

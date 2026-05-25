import type { GridRowModel } from '@mui/x-data-grid';
import type { HostDataQueryProvider } from '@mui/x-copilot';
import type { DataStudioDataset } from '../../DataStudio/DataStudio.types';
import {
  QUERY_STUDIO_DATA_TOOL_NAME,
  type StudioDataQueryColumnMeta,
  type StudioDataQueryInput,
  type StudioDataQueryResult,
} from './types';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

function findDataset(
  datasets: ReadonlyArray<DataStudioDataset<any>>,
  datasetId: string,
): DataStudioDataset<any> | undefined {
  return datasets.find((d) => d.id === datasetId);
}

function projectColumns(
  dataset: DataStudioDataset<any>,
): ReadonlyArray<StudioDataQueryColumnMeta> {
  return (dataset.columns ?? []).map((col) => ({
    field: col.field,
    headerName: typeof col.headerName === 'string' ? col.headerName : undefined,
  }));
}

function projectRows(
  dataset: DataStudioDataset<any>,
  limit: number,
): ReadonlyArray<GridRowModel> {
  const raw = Array.isArray(dataset.rows) ? (dataset.rows as ReadonlyArray<GridRowModel>) : [];
  if (raw.length <= limit) {
    return raw;
  }
  return raw.slice(0, limit);
}

/**
 * Build a `HostDataQueryProvider` that responds to `queryStudioData` calls
 * by reading from the active studio's static dataset rows. Data-source-backed
 * datasets return an empty row set today; full async query support is a
 * follow-up.
 */
export function createQueryStudioDataProvider(
  datasets: () => ReadonlyArray<DataStudioDataset<any>>,
): HostDataQueryProvider<StudioDataQueryInput, StudioDataQueryResult> {
  return {
    toolNames: [QUERY_STUDIO_DATA_TOOL_NAME],

    validateInput(raw) {
      if (!raw || typeof raw !== 'object') {
        return { ok: false, reason: 'queryStudioData input must be an object' };
      }
      const candidate = raw as Partial<StudioDataQueryInput>;
      if (typeof candidate.datasetId !== 'string' || candidate.datasetId.trim() === '') {
        return { ok: false, reason: 'queryStudioData requires { datasetId: string }' };
      }
      if (candidate.limit != null && (!Number.isFinite(candidate.limit) || candidate.limit < 0)) {
        return { ok: false, reason: 'queryStudioData.limit must be a non-negative number' };
      }
      const exists = findDataset(datasets(), candidate.datasetId);
      if (!exists) {
        return { ok: false, reason: `queryStudioData: unknown datasetId '${candidate.datasetId}'` };
      }
      return { ok: true, input: { datasetId: candidate.datasetId, limit: candidate.limit } };
    },

    preview(input) {
      const dataset = findDataset(datasets(), input.datasetId);
      if (!dataset) {
        return { meta: { datasetId: input.datasetId, rowCount: 0, columns: [] } };
      }
      const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
      const rows = projectRows(dataset, limit);
      return {
        meta: {
          datasetId: dataset.id,
          rowCount: rows.length,
          columns: projectColumns(dataset),
        },
      };
    },

    execute(input) {
      const dataset = findDataset(datasets(), input.datasetId);
      if (!dataset) {
        return {
          meta: { datasetId: input.datasetId, rowCount: 0, columns: [] },
          rows: [],
        };
      }
      const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
      const rows = projectRows(dataset, limit);
      return {
        meta: {
          datasetId: dataset.id,
          rowCount: rows.length,
          columns: projectColumns(dataset),
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

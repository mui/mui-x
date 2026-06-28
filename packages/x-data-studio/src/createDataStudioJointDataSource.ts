import type * as React from 'react';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import type { DataStudioDataSource } from './DataStudio/DataStudio.types';
import { DATA_STUDIO_SYNTHETIC_ID_FIELD, type DataStudioJoinDefinition } from './models';

export interface CreateDataStudioJointDataSourceOptions {
  /**
   * Stable id for the joint source (distinct from any base source id). Used as
   * the sidebar/sheet `dataSourceId`.
   */
  id: string;
  /** Label shown in the data sources tree. */
  label: React.ReactNode;
  /** The user-authored join definition. */
  definition: DataStudioJoinDefinition;
  /** All available base data sources (the join references these by id). */
  baseDataSources: DataStudioDataSource[];
}

/**
 * Builds a client `DataStudioDataSource` from a **user-authored** join definition
 * (never a code-defined one). The joint source reuses the base (fact) source's
 * connector — which already targets the right rows endpoint with the base's
 * `dataSourceId` — and injects `params.join` on every request, exactly like the
 * chart injects `binning`. The server's base source self-handles the join. The
 * output columns are derived **client-side** from the participating base sources'
 * column definitions (no schema round-trip), aliased to the definition's flat
 * output fields. Read-only.
 * @param {CreateDataStudioJointDataSourceOptions} options The joint source options.
 * @returns {DataStudioDataSource} A data source the pivot/chart/grid views consume.
 */
export function createDataStudioJointDataSource<R extends GridValidRowModel = any>(
  options: CreateDataStudioJointDataSourceOptions,
): DataStudioDataSource<R> {
  const { id, label, definition, baseDataSources } = options;

  const sourcesById = new Map(baseDataSources.map((source) => [source.id, source]));
  const base = sourcesById.get(definition.base);

  if (!base) {
    throw new Error(
      `MUI X Data Studio: The joint source "${id}" references an unknown base data source "${definition.base}".
This prevents Data Studio from resolving the join's columns and connector.
Build the joint source from the same data sources passed to <DataStudio dataSources={...} />.`,
    );
  }
  if (!base.connector) {
    throw new Error(
      `MUI X Data Studio: The base data source "${definition.base}" of joint source "${id}" has no connector.
This prevents the joint source from running the JOIN server-side.
Joint sources require a server-backed base data source (one with a connector).`,
    );
  }

  const baseConnector = base.connector;

  // Derive the output columns from the participating sources' column definitions,
  // aliased to the join's flat output fields.
  const columns: GridColDef<R>[] = definition.columns.map((column) => {
    const source = sourcesById.get(column.sourceId);
    const sourceColumn = source?.columns.find((candidate) => candidate.field === column.field);

    return {
      ...(sourceColumn as GridColDef<R> | undefined),
      field: column.as,
      headerName: sourceColumn?.headerName ?? column.field,
    } as GridColDef<R>;
  });

  return {
    id,
    label,
    columns,
    rowIdField: DATA_STUDIO_SYNTHETIC_ID_FIELD,
    getRowId: (row) =>
      (row[DATA_STUDIO_SYNTHETIC_ID_FIELD as keyof typeof row] as any) ??
      (row as { id?: any }).id,
    // Reuse the base connector (right endpoint + base dataSourceId), injecting the
    // join on every request so the server's base source self-handles it.
    connector: {
      ...baseConnector,
      getRows: (params) => baseConnector.getRows({ ...params, join: definition }),
    },
    // The join runs server-side over the whole dataset → charts can aggregate it
    // instead of sampling.
    supportsServerGrouping: base.supportsServerGrouping ?? true,
  };
}

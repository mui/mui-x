'use client';
import * as React from 'react';
import { type ColumnDef, useDataGrid } from '../';
import { sortingPlugin, type SortingColumnMeta, type SortingOptions } from '../plugins/sorting';
import {
  filteringPlugin,
  type FilteringColumnMeta,
  type FilteringOptions,
} from '../plugins/filtering';
import { paginationPlugin } from '../plugins/pagination';
import rowsPlugin from '../plugins/internal/rows/rows';
import columnsPlugin from '../plugins/internal/columns/columns';

type GridApi = ReturnType<
  typeof useDataGrid<
    [typeof sortingPlugin, typeof filteringPlugin, typeof paginationPlugin],
    any
  >
>;

interface TestDataGridProps<TRow extends Record<string, any>> {
  rows: TRow[];
  columns: ColumnDef<TRow, SortingColumnMeta & FilteringColumnMeta>[];
  getRowId?: (row: TRow) => string;
  apiRef?: React.RefObject<GridApi | null>;
  sorting?: SortingOptions['sorting'];
  filtering?: FilteringOptions['filtering'];
  initialState?: Parameters<typeof useDataGrid>[0]['initialState'];
}

export function TestDataGrid<TRow extends Record<string, any>>(props: TestDataGridProps<TRow>) {
  const { rows, columns, getRowId, apiRef, sorting, filtering, initialState } = props;

  const grid = useDataGrid<
    [typeof sortingPlugin, typeof filteringPlugin, typeof paginationPlugin],
    TRow
  >({
    rows,
    columns,
    getRowId,
    plugins: [sortingPlugin, filteringPlugin, paginationPlugin],
    sorting,
    filtering,
    initialState,
  });

  React.useEffect(() => {
    if (apiRef) {
      (apiRef as React.RefObject<GridApi | null>).current = grid;
    }
  }, [grid, apiRef]);

  const filteredRowIds = grid.use(filteringPlugin.selectors.filteredRowIds);
  const rowsData = grid.use(rowsPlugin.selectors.rowIdToModelLookup);
  const visibleColumns = grid.use(columnsPlugin.selectors.visibleColumns);

  return (
    <div data-testid="grid">
      {filteredRowIds.map((rowId) => {
        const row = rowsData[rowId] as TRow | undefined;
        if (!row) {
          return null;
        }
        return (
          <div
            key={rowId}
            data-testid="row"
            {...Object.fromEntries(
              Object.entries(row).map(([key, value]) => [
                `data-${key.toLowerCase()}`,
                String(value),
              ]),
            )}
          >
            {visibleColumns.map((column, colIndex) => {
              const value = row[column.field as keyof TRow];
              return (
                <div key={column.id} role="gridcell" data-colindex={colIndex}>
                  {value != null ? String(value) : ''}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

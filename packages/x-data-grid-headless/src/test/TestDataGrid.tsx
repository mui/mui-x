'use client';
import * as React from 'react';
import { type ColumnDef, useDataGrid } from '../';
import { sortingPlugin, type SortingColumnMeta } from '../plugins/sorting';
import { paginationPlugin } from '../plugins/pagination';
import { rowsPlugin, columnsPlugin } from '../plugins/internal';

type GridApi = ReturnType<typeof useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], any>>;

interface TestDataGridProps<TRow extends Record<string, any>> {
  rows: TRow[];
  columns: ColumnDef<TRow, SortingColumnMeta>[];
  getRowId?: (row: TRow) => string;
  apiRef?: React.RefObject<GridApi | null>;
  sortModel?: Parameters<typeof useDataGrid>[0]['sortModel'];
  initialState?: Parameters<typeof useDataGrid>[0]['initialState'];
  onSortModelChange?: Parameters<typeof useDataGrid>[0]['onSortModelChange'];
  onSortedRowsSet?: Parameters<typeof useDataGrid>[0]['onSortedRowsSet'];
  sortingMode?: Parameters<typeof useDataGrid>[0]['sortingMode'];
  enableMultiSort?: Parameters<typeof useDataGrid>[0]['enableMultiSort'];
  stableSort?: Parameters<typeof useDataGrid>[0]['stableSort'];
  sortingOrder?: Parameters<typeof useDataGrid>[0]['sortingOrder'];
}

export function TestDataGrid<TRow extends Record<string, any>>(props: TestDataGridProps<TRow>) {
  const { rows, columns, getRowId, apiRef, ...gridProps } = props;

  const grid = useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], TRow>({
    rows,
    columns,
    getRowId,
    plugins: [sortingPlugin, paginationPlugin],
    ...gridProps,
  });

  React.useEffect(() => {
    if (apiRef) {
      (apiRef as React.RefObject<GridApi | null>).current = grid;
    }
  }, [grid, apiRef]);

  const sortedRowIds = grid.use(sortingPlugin.selectors.sortedRowIds);
  const rowsData = grid.use(rowsPlugin.selectors.rowIdToModelLookup);
  const visibleColumns = grid.use(columnsPlugin.selectors.visibleColumns);

  return (
    <div data-testid="grid">
      {sortedRowIds.map((rowId) => {
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

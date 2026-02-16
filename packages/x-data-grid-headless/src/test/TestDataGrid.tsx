'use client';
import * as React from 'react';
import { type ColumnDef, useDataGrid } from '../';
import { sortingPlugin, type SortingColumnMeta, type SortingOptions } from '../plugins/sorting';
import {
  filteringPlugin,
  type FilteringColumnMeta,
  type FilteringOptions,
} from '../plugins/filtering';
import { paginationPlugin, type PaginationOptions } from '../plugins/pagination';
import rowsPlugin from '../plugins/internal/rows/rows';
import columnsPlugin from '../plugins/internal/columns/columns';

const plugins = [sortingPlugin, filteringPlugin, paginationPlugin] as const;

export type TestGridApi = ReturnType<typeof useDataGrid<typeof plugins, any>>;

interface TestDataGridProps<TRow extends Record<string, any>> {
  rows: TRow[];
  columns: ColumnDef<TRow, SortingColumnMeta & FilteringColumnMeta>[];
  getRowId?: (row: TRow) => string;
  apiRef?: React.RefObject<TestGridApi | null>;
  sorting?: SortingOptions['sorting'];
  filtering?: FilteringOptions['filtering'];
  rowCount?: number;
  pagination?: PaginationOptions['pagination'];
  initialState?: Parameters<typeof useDataGrid>[0]['initialState'];
}

export function TestDataGrid<TRow extends Record<string, any>>(props: TestDataGridProps<TRow>) {
  const {
    rows,
    columns,
    getRowId,
    rowCount,
    apiRef,
    sorting,
    filtering,
    pagination,
    initialState,
  } = props;

  const grid = useDataGrid({
    rows,
    columns,
    getRowId,
    rowCount,
    plugins: [sortingPlugin, paginationPlugin],
    sorting,
    filtering,
    pagination,
    initialState,
  });

  React.useEffect(() => {
    if (apiRef) {
      (apiRef as React.RefObject<TestGridApi | null>).current = grid;
    }
  }, [grid, apiRef]);

  const visibleRowIds = grid.use(rowsPlugin.selectors.processedRowIds);
  const rowsData = grid.use(rowsPlugin.selectors.rowIdToModelLookup);
  const visibleColumns = grid.use(columnsPlugin.selectors.visibleColumns);

  return (
    <div data-testid="grid">
      {visibleRowIds.map((rowId) => {
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

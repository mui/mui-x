'use client';
import * as React from 'react';
import { ColumnDef, useDataGrid } from '../';
import sortingPlugin from '../plugins/sorting';
import paginationPlugin from '../plugins/pagination';

export function TestDataGrid<TRow extends object>(props: {
  rows: TRow[];
  columns: ColumnDef<TRow>[];
  getRowId?: (row: TRow) => string;
  apiRef?: React.MutableRefObject<ReturnType<
    typeof useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], TRow>
  > | null>;
}) {
  const grid = useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], TRow>({
    rows: props.rows,
    getRowId: props.getRowId,
    columns: props.columns,
    plugins: [sortingPlugin, paginationPlugin],
  });

  React.useEffect(() => {
    if (props.apiRef) {
      props.apiRef.current = grid;
    }
  }, [grid, props.apiRef]);

  const rowIds = grid.store.use(grid.api.rows.selectors.rowIds);
  const rowsData = grid.store.use(grid.api.rows.selectors.rowIdToModelLookup);
  const visibleColumns = grid.store.use(grid.api.columns.selectors.visibleColumns);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '100%' }}>
      <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>
        <tr>
          {visibleColumns.map((column: (typeof visibleColumns)[0]) => (
            <th
              key={column.id}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                borderBottom: '2px solid #e0e0e0',
                fontWeight: 600,
                fontSize: '14px',
                width: column.width || 150,
                minWidth: column.width || 150,
              }}
            >
              {column.header || column.id}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowIds.map((rowId: (typeof rowIds)[0]) => {
          const row = rowsData[rowId] as TRow | undefined;
          if (!row) {
            return null;
          }
          return (
            <tr
              key={rowId}
              className="data-grid-row"
              style={{
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              {visibleColumns.map((column: (typeof visibleColumns)[0], index: number) => {
                const value = row[column.field as keyof TRow];
                return (
                  <td
                    // TODO: It should use the elements API when added
                    role="gridcell"
                    data-colindex={index}
                    key={column.id}
                    style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      width: column.width || 150,
                      minWidth: column.width || 150,
                    }}
                  >
                    {value != null ? String(value) : ''}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

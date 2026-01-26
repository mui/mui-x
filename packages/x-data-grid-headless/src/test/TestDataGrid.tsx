'use client';
import * as React from 'react';
import { ColumnDef, useDataGrid } from '../';
import { sortingPlugin, paginationPlugin } from '../plugins';
import { ConfigPanel, type PluginConfig } from './ConfigPanel';

export function TestDataGrid<TRow extends object>(props: {
  rows: TRow[];
  columns: ColumnDef<TRow>[];
  getRowId?: (row: TRow) => string;
  apiRef?: React.RefObject<ReturnType<
    typeof useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], TRow>
  > | null>;
  showConfig?: boolean;
}) {
  const [config, setConfig] = React.useState<PluginConfig>({
    sorting: {
      enabled: true,
      enableMultiSort: true,
      sortingMode: 'auto',
      stableSort: false,
      sortingOrder: ['asc', 'desc', null],
    },
  });

  const grid = useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], TRow>({
    rows: props.rows,
    getRowId: props.getRowId,
    columns: props.columns,
    plugins: [sortingPlugin, paginationPlugin],
    // Sorting options from config
    enableMultiSort: config.sorting?.enableMultiSort,
    sortingMode: config.sorting?.sortingMode,
    stableSort: config.sorting?.stableSort,
    sortingOrder: config.sorting?.sortingOrder,
    onSortModelChange: (model) => {
      // eslint-disable-next-line no-console
      console.log('Sort model changed:', model);
    },
  });

  React.useEffect(() => {
    if (props.apiRef) {
      props.apiRef.current = grid;
    }
  }, [grid, props.apiRef]);

  // Use sorted row IDs from sorting plugin
  const sortedRowIds = grid.use(grid.api.sorting.selectors.sortedRowIds);
  const sortColumnLookup = grid.use(grid.api.sorting.selectors.sortColumnLookup);
  const rowsData = grid.use(grid.api.rows.selectors.rowIdToModelLookup);
  const visibleColumns = grid.use(grid.api.columns.selectors.visibleColumns);

  const handleColumnHeaderClick = (field: string, event: React.MouseEvent) => {
    if (!config.sorting?.enabled) {
      return;
    }
    // Use shift key for multi-sort when enabled
    const multiSort = config.sorting?.enableMultiSort && event.shiftKey;
    grid.api.sorting.sortColumn(field, undefined, multiSort);
  };

  const handleApplySorting = () => {
    grid.api.sorting.applySorting();
  };

  const getSortIcon = (field: string) => {
    const sortInfo = sortColumnLookup[field];
    if (!sortInfo || sortInfo.sortDirection === null) {
      return null;
    }
    const arrow = sortInfo.sortDirection === 'asc' ? '↑' : '↓';
    const index = config.sorting?.enableMultiSort ? ` (${sortInfo.sortIndex + 1})` : '';
    return (
      <span style={{ marginLeft: 4, fontSize: '12px' }}>
        {arrow}
        {index}
      </span>
    );
  };

  return (
    <div>
      {props.showConfig !== false && (
        <ConfigPanel
          config={config}
          onConfigChange={setConfig}
          onApplySorting={handleApplySorting}
        />
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '100%' }}>
        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>
          <tr>
            {visibleColumns.map((column: (typeof visibleColumns)[0]) => (
              <th
                key={column.id}
                onClick={(event) => handleColumnHeaderClick(column.field as string, event)}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderBottom: '2px solid #e0e0e0',
                  fontWeight: 600,
                  fontSize: '14px',
                  width: column.size || 150,
                  minWidth: column.size || 150,
                  cursor: config.sorting?.enabled ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
              >
                {column.header || column.id}
                {config.sorting?.enabled && getSortIcon(column.field as string)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRowIds.map((rowId: (typeof sortedRowIds)[0]) => {
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
                        width: column.size || 150,
                        minWidth: column.size || 150,
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
    </div>
  );
}

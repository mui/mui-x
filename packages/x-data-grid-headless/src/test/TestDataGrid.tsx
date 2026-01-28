'use client';
import * as React from 'react';
import { type ColumnDef, useDataGrid } from '../';
import { sortingPlugin, paginationPlugin, rowsPlugin, columnsPlugin } from '../plugins';
import { ConfigPanel, type PluginConfig } from './ConfigPanel';
import './styles.css';

/**
 * This is a test component for the Data Grid.
 * It is used to test the Data Grid in a standalone environment.
 * It is not meant to be used in production.
 */
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
      multiSortWithShiftKey: true,
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
  const sortedRowIds = grid.use(sortingPlugin.selectors.sortedRowIds);
  const sortModel = grid.use(sortingPlugin.selectors.sortModel);
  const rowsData = grid.use(rowsPlugin.selectors.rowIdToModelLookup);
  const visibleColumns = grid.use(columnsPlugin.selectors.visibleColumns);

  const handleColumnHeaderClick = (field: string, event: React.MouseEvent) => {
    if (!config.sorting?.enabled) {
      return;
    }
    // Use shift key for multi-sort when multiSortWithShiftKey is true (default)
    const requireShiftKey = config.sorting?.multiSortWithShiftKey ?? true;
    const multiSort = config.sorting?.enableMultiSort && (!requireShiftKey || event.shiftKey);
    grid.api.sorting.sortColumn(field, undefined, multiSort);
  };

  const handleApplySorting = () => {
    grid.api.sorting.applySorting();
  };

  const getSortIcon = (field: string) => {
    const sortIndex = sortModel.findIndex((item) => item.field === field);
    const sortInfo = sortModel[sortIndex];
    if (!sortInfo || sortInfo.sort === null) {
      return null;
    }
    const arrow = sortInfo.sort === 'asc' ? '↑' : '↓';
    const index = config.sorting?.enableMultiSort ? ` (${sortIndex + 1})` : '';
    return (
      <span className="grid-sort-icon">
        {arrow}
        {index}
      </span>
    );
  };

  const showConfigPanel = props.showConfig !== false;

  return (
    <div className="test-grid-container">
      {/* Grid Wrapper */}
      <div className="grid-wrapper">
        <div className="grid-scroll-container">
          <table className="grid-table">
            <thead className="grid-thead">
              <tr>
                {visibleColumns.map((column) => {
                  const isSortable = config.sorting?.enabled && column.sortable !== false;
                  const thClassName = ['grid-th', isSortable && 'grid-th--sortable']
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <th
                      key={column.id}
                      onClick={(event) => handleColumnHeaderClick(column.field as string, event)}
                      className={thClassName}
                      style={{
                        width: column.size || 150,
                        minWidth: column.size || 150,
                      }}
                    >
                      {column.header || column.id}
                      {config.sorting?.enabled && getSortIcon(column.field as string)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedRowIds.map((rowId: (typeof sortedRowIds)[0]) => {
                const row = rowsData[rowId] as TRow | undefined;
                if (!row) {
                  return null;
                }
                return (
                  <tr key={rowId} className="grid-tr">
                    {visibleColumns.map((column: (typeof visibleColumns)[0], index: number) => {
                      const value = row[column.field as keyof TRow];
                      return (
                        <td
                          role="gridcell"
                          data-colindex={index}
                          key={column.id}
                          className="grid-td"
                          style={{
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
      </div>

      {/* Config Panel (Side Panel) */}
      {showConfigPanel && (
        <ConfigPanel
          config={config}
          onConfigChange={setConfig}
          onApplySorting={handleApplySorting}
        />
      )}
    </div>
  );
}

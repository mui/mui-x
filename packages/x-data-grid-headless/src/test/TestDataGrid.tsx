'use client';
import * as React from 'react';
import { ColumnDef, useDataGrid, SortingOptions, GridSortDirection } from '../';
import sortingPlugin from '../plugins/sorting';
import paginationPlugin from '../plugins/pagination';

interface PluginConfig {
  sorting?: SortingOptions & {
    enabled?: boolean;
  };
}

export function TestDataGrid<TRow extends object>(props: {
  rows: TRow[];
  columns: ColumnDef<TRow>[];
  getRowId?: (row: TRow) => string;
  apiRef?: React.MutableRefObject<ReturnType<
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
      {props.showConfig !== false && <ConfigPanel config={config} onConfigChange={setConfig} />}
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

// Configuration Panel Component
function ConfigPanel(props: {
  config: PluginConfig;
  onConfigChange: (config: PluginConfig) => void;
}) {
  const { config, onConfigChange } = props;

  const updateSortingConfig = (updates: Partial<PluginConfig['sorting']>) => {
    onConfigChange({
      ...config,
      sorting: {
        ...config.sorting,
        ...updates,
      },
    });
  };

  const sortingOrderOptions: { label: string; value: readonly GridSortDirection[] }[] = [
    { label: 'asc → desc → null', value: ['asc', 'desc', null] },
    { label: 'desc → asc → null', value: ['desc', 'asc', null] },
    { label: 'asc → desc (no null)', value: ['asc', 'desc'] },
    { label: 'asc only', value: ['asc'] },
    { label: 'desc only', value: ['desc'] },
  ];

  const getCurrentSortingOrderLabel = () => {
    const current = config.sorting?.sortingOrder;
    const match = sortingOrderOptions.find(
      (opt) => JSON.stringify(opt.value) === JSON.stringify(current),
    );
    return match?.label || 'Custom';
  };

  return (
    <div
      style={{
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
        Plugin Configuration
      </h3>

      {/* Sorting Section */}
      <fieldset style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '4px' }}>
        <legend style={{ fontSize: '13px', fontWeight: 500, padding: '0 8px' }}>
          Sorting Plugin
        </legend>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={config.sorting?.enabled ?? true}
              onChange={(event) => updateSortingConfig({ enabled: event.target.checked })}
            />
            Enable Sorting
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={config.sorting?.enableMultiSort ?? true}
              onChange={(event) => updateSortingConfig({ enableMultiSort: event.target.checked })}
              disabled={!config.sorting?.enabled}
            />
            Enable Multi-Sort (hold Shift + click)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={config.sorting?.stableSort ?? false}
              onChange={(event) => updateSortingConfig({ stableSort: event.target.checked })}
              disabled={!config.sorting?.enabled}
            />
            Stable Sort (preserve previous sort order)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            Sorting Mode:
            <select
              value={config.sorting?.sortingMode ?? 'auto'}
              onChange={(event) =>
                updateSortingConfig({ sortingMode: event.target.value as 'auto' | 'manual' })
              }
              disabled={!config.sorting?.enabled}
              style={{ padding: '4px 8px', fontSize: '13px' }}
            >
              <option value="auto">Auto (sorts on change)</option>
              <option value="manual">Manual (call applySorting)</option>
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            Sorting Order:
            <select
              value={getCurrentSortingOrderLabel()}
              onChange={(event) => {
                const selected = sortingOrderOptions.find(
                  (opt) => opt.label === event.target.value,
                );
                if (selected) {
                  updateSortingConfig({ sortingOrder: selected.value });
                }
              }}
              disabled={!config.sorting?.enabled}
              style={{ padding: '4px 8px', fontSize: '13px' }}
            >
              {sortingOrderOptions.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>
    </div>
  );
}

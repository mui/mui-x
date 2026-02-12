import * as React from 'react';
import { type ColumnDef, useDataGrid } from '@mui/x-data-grid-headless';
import { rowsPlugin, columnsPlugin } from '@mui/x-data-grid-headless';
import { sortingPlugin, type SortingColumnMeta } from '@mui/x-data-grid-headless/plugins/sorting';
import {
  filteringPlugin,
  type FilteringColumnMeta,
} from '@mui/x-data-grid-headless/plugins/filtering';
import { paginationPlugin } from '@mui/x-data-grid-headless/plugins/pagination';

import { ConfigPanel, type PluginConfig } from './ConfigPanel';
import { FilterPanel } from './FilterPanel';
import { FilterIcon } from './icons';

interface RowData {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
}

type ColumnMeta = SortingColumnMeta & FilteringColumnMeta;

const departments = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
  'Support',
  'Product',
];

// Utility function to shuffle an array randomly
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate sample data with random order
function generateSampleData(count: number): RowData[] {
  const names = [
    'John',
    'Jane',
    'Bob',
    'Alice',
    'Charlie',
    'Diana',
    'Eve',
    'Frank',
    'Grace',
    'Henry',
  ];
  const surnames = [
    'Doe',
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Wilson',
  ];

  // Create all possible combinations and shuffle them
  const allCombinations: RowData[] = [];
  for (let i = 0; i < count; i += 1) {
    const nameIndex = Math.floor(Math.random() * names.length);
    const surnameIndex = Math.floor(Math.random() * surnames.length);
    const departmentIndex = Math.floor(Math.random() * departments.length);
    const age = 20 + Math.floor(Math.random() * 40);

    allCombinations.push({
      id: i + 1,
      name: `${names[nameIndex]} ${surnames[surnameIndex]}`,
      email: `${names[nameIndex].toLowerCase()}.${surnames[surnameIndex].toLowerCase()}@example.com`,
      age,
      department: departments[departmentIndex],
    });
  }

  // Shuffle the final array to randomize order
  return shuffleArray(allCombinations);
}

// Generate sample columns with random order
function generateColumns() {
  const allColumns: ColumnDef<RowData, ColumnMeta>[] = [
    { id: 'id', field: 'id', header: 'ID', size: 80, type: 'number' },
    { id: 'name', field: 'name', header: 'Name', size: 200 },
    { id: 'email', field: 'email', header: 'Email', size: 250 },
    { id: 'age', field: 'age', header: 'Age', size: 100, type: 'number' },
    {
      id: 'department',
      field: 'department',
      header: 'Department',
      size: 150,
      type: 'singleSelect',
      valueOptions: departments,
    },
  ];

  // Shuffle columns to randomize order
  return shuffleArray(allColumns);
}

interface DataGridHandle {
  applySorting: () => void;
  applyFiltering: () => void;
}

interface DataGridProps {
  rows: RowData[];
  columns: ColumnDef<RowData, ColumnMeta>[];
  config: PluginConfig;
  ref?: React.Ref<DataGridHandle>;
}

function DataGrid(props: DataGridProps) {
  const { config, ref } = props;
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);

  const isFilteringEnabled = config.filtering?.enabled ?? true;

  const grid = useDataGrid({
    rows: props.rows,
    columns: props.columns,
    plugins: [sortingPlugin, filteringPlugin, paginationPlugin],
    // Sorting options from config
    sorting: {
      multiSort: config.sorting?.multiSort,
      mode: config.sorting?.mode,
      stableSort: config.sorting?.stableSort,
      order: config.sorting?.order,
      onModelChange: (model) => {
        // eslint-disable-next-line no-console
        console.log('Sort model changed:', model);
      },
    },
    // Filtering options from config
    filtering: {
      mode: config.filtering?.mode,
      disableEval: config.filtering?.disableEval,
      onModelChange: (model) => {
        // eslint-disable-next-line no-console
        console.log('Filter model changed:', model);
      },
    },
  });

  React.useImperativeHandle(ref, () => ({
    applySorting: () => grid.api.sorting.apply(),
    applyFiltering: () => grid.api.filtering.apply(),
  }));

  // Use filtered row IDs (filtering sits after sorting in the pipeline)
  const filteredRowIds = grid.use(filteringPlugin.selectors.filteredRowIds);
  const filterModel = grid.use(filteringPlugin.selectors.model);
  const sortModel = grid.use(sortingPlugin.selectors.model);
  const rowsData = grid.use(rowsPlugin.selectors.rowIdToModelLookup);
  const visibleColumns = grid.use(columnsPlugin.selectors.visibleColumns);

  const activeFilterCount = filterModel.conditions.length;

  const handleFilterModelChange = (model: typeof filterModel) => {
    grid.api.filtering.setModel(model);
  };

  const handleColumnHeaderClick = (field: string, event: React.MouseEvent) => {
    if (!config.sorting?.enabled) {
      return;
    }
    // Use shift key for multi-sort when multiSortWithShiftKey is true (default)
    const requireShiftKey = config.sorting?.multiSortWithShiftKey ?? true;
    const multiSort = config.sorting?.multiSort && (!requireShiftKey || event.shiftKey);
    grid.api.sorting.sortColumn(field, undefined, multiSort);
  };

  const getSortIcon = (field: string) => {
    const sortIndex = sortModel.findIndex((item) => item.field === field);
    const sortInfo = sortModel[sortIndex];
    if (!sortInfo || sortInfo.direction === null) {
      return null;
    }
    const arrow = sortInfo.direction === 'asc' ? '↑' : '↓';
    const index = config.sorting?.multiSort ? ` (${sortIndex + 1})` : '';
    return (
      <span className="grid-sort-icon">
        {arrow}
        {index}
      </span>
    );
  };

  const toolbarBtnClassName = ['grid-toolbar__btn', filterPanelOpen && 'grid-toolbar__btn--active']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="grid-wrapper">
      {/* Toolbar */}
      <div className="grid-toolbar">
        <button
          type="button"
          className={toolbarBtnClassName}
          onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          disabled={!isFilteringEnabled}
        >
          <FilterIcon />
          <span>Filters</span>
          {isFilteringEnabled && activeFilterCount > 0 && (
            <span className="grid-toolbar__badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Filter Panel (collapsible) */}
      {filterPanelOpen && isFilteringEnabled && (
        <div className="grid-filter-panel-container">
          <FilterPanel
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            columns={visibleColumns}
          />
        </div>
      )}

      {/* Table */}
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
            {filteredRowIds.map((rowId: (typeof filteredRowIds)[0]) => {
              const row = rowsData[rowId] as RowData | undefined;
              if (!row) {
                return null;
              }
              return (
                <tr key={rowId} className="grid-tr">
                  {visibleColumns.map((column: (typeof visibleColumns)[0], index: number) => {
                    const value = row[column.field as keyof RowData];
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
            {filteredRowIds.length === 0 && (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="grid-td"
                  style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}
                >
                  No rows to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const [rows] = React.useState<RowData[]>(() => generateSampleData(30));
  const [columns] = React.useState(() => generateColumns());
  const [config, setConfig] = React.useState<PluginConfig>({
    sorting: {
      enabled: true,
      multiSort: true,
      multiSortWithShiftKey: true,
      mode: 'auto',
      stableSort: false,
      order: ['asc', 'desc', null],
    },
    filtering: {
      enabled: true,
      mode: 'auto',
      disableEval: false,
    },
  });

  const gridRef = React.useRef<DataGridHandle>(null);

  const handleApplySorting = () => {
    gridRef.current?.applySorting();
  };

  const handleApplyFiltering = () => {
    gridRef.current?.applyFiltering();
  };

  return (
    <div className="test-grid-container">
      <DataGrid ref={gridRef} rows={rows} columns={columns} config={config} />
      <ConfigPanel
        config={config}
        onConfigChange={setConfig}
        onApplySorting={handleApplySorting}
        onApplyFiltering={handleApplyFiltering}
      />
    </div>
  );
}

export default App;

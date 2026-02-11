import * as React from 'react';
import { type ColumnDef, useDataGrid } from '@mui/x-data-grid-headless';
import { rowsPlugin, columnsPlugin } from '@mui/x-data-grid-headless';
import { sortingPlugin } from '@mui/x-data-grid-headless/plugins/sorting';
import { paginationPlugin } from '@mui/x-data-grid-headless/plugins/pagination';

import { ConfigPanel, type PluginConfig } from './ConfigPanel';

interface RowData {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
}

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
  const allColumns: ColumnDef<RowData>[] = [
    { id: 'id', field: 'id' as keyof RowData, header: 'ID', size: 80 },
    { id: 'name', field: 'name' as keyof RowData, header: 'Name', size: 200 },
    { id: 'email', field: 'email' as keyof RowData, header: 'Email', size: 250 },
    { id: 'age', field: 'age' as keyof RowData, header: 'Age', size: 100 },
    { id: 'department', field: 'department' as keyof RowData, header: 'Department', size: 150 },
  ];

  // Shuffle columns to randomize order
  return shuffleArray(allColumns);
}

interface DataGridHandle {
  applySorting: () => void;
}

interface DataGridProps {
  rows: RowData[];
  columns: ColumnDef<RowData>[];
  config: PluginConfig;
  ref?: React.Ref<DataGridHandle>;
}

function DataGrid(props: DataGridProps) {
  const { config, ref } = props;

  const grid = useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], RowData>({
    rows: props.rows,
    columns: props.columns,
    plugins: [sortingPlugin, paginationPlugin],
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
    // Pagination options from config
    pagination: {
      onModelChange: (model) => {
        // eslint-disable-next-line no-console
        console.log('Pagination model changed:', model);
      },
    },
    initialState: {
      pagination: {
        model: {
          page: 0,
          pageSize: config.pagination?.pageSize ?? 10,
        },
      },
    },
  });

  React.useImperativeHandle(ref, () => ({
    applySorting: () => grid.api.sorting.apply(),
  }));

  // Sync page size with config changes (including disabling pagination)
  const effectivePageSize = config.pagination?.enabled
    ? (config.pagination?.pageSize ?? 10)
    : Infinity;

  React.useEffect(() => {
    grid.api.pagination.setPageSize(effectivePageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- grid.api is stable by identity but not by reference
  }, [effectivePageSize]);

  // Use paginated row IDs from pagination plugin
  const paginatedRowIds = grid.use(paginationPlugin.selectors.paginatedRowIds);
  const paginationModel = grid.use(paginationPlugin.selectors.model);
  const pageCount = grid.use(paginationPlugin.selectors.pageCount);
  const rowCount = grid.use(paginationPlugin.selectors.rowCount);
  const startRow = grid.use(paginationPlugin.selectors.startRow);
  const endRow = grid.use(paginationPlugin.selectors.endRow);
  const sortModel = grid.use(sortingPlugin.selectors.model);
  const rowsData = grid.use(rowsPlugin.selectors.rowIdToModelLookup);
  const visibleColumns = grid.use(columnsPlugin.selectors.visibleColumns);

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

  // Scroll to top when page changes
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }, [paginationModel.page]);

  return (
    <div className="grid-wrapper">
      <div className="grid-scroll-container" ref={scrollContainerRef}>
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
            {paginatedRowIds.map((rowId: (typeof paginatedRowIds)[0]) => {
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
          </tbody>
        </table>
      </div>
      {/* Pagination Footer */}
      {config.pagination?.enabled && (
        <div className="grid-footer">
          <div className="grid-footer__info">
            {rowCount > 0 ? `${startRow}–${endRow} of ${rowCount}` : 'No rows'}
          </div>
          <div className="grid-footer__controls">
            <button
              type="button"
              className="grid-footer__btn"
              disabled={paginationModel.page === 0}
              onClick={() => grid.api.pagination.setPage(0)}
              aria-label="First page"
            >
              ⟨⟨
            </button>
            <button
              type="button"
              className="grid-footer__btn"
              disabled={paginationModel.page === 0}
              onClick={() => grid.api.pagination.setPage(paginationModel.page - 1)}
              aria-label="Previous page"
            >
              ⟨
            </button>
            <span className="grid-footer__page-info">
              Page {paginationModel.page + 1} of {pageCount}
            </span>
            <button
              type="button"
              className="grid-footer__btn"
              disabled={paginationModel.page >= pageCount - 1}
              onClick={() => grid.api.pagination.setPage(paginationModel.page + 1)}
              aria-label="Next page"
            >
              ⟩
            </button>
            <button
              type="button"
              className="grid-footer__btn"
              disabled={paginationModel.page >= pageCount - 1}
              onClick={() => grid.api.pagination.setPage(pageCount - 1)}
              aria-label="Last page"
            >
              ⟩⟩
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [rows] = React.useState<RowData[]>(() => generateSampleData(100));
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
    pagination: {
      enabled: true,
      pageSize: 10,
    },
  });

  const gridRef = React.useRef<DataGridHandle>(null);

  const handleApplySorting = () => {
    gridRef.current?.applySorting();
  };

  return (
    <div className="test-grid-container">
      <DataGrid ref={gridRef} rows={rows} columns={columns} config={config} />
      <ConfigPanel config={config} onConfigChange={setConfig} onApplySorting={handleApplySorting} />
    </div>
  );
}

export default App;

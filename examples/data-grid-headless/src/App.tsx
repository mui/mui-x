import * as React from 'react';
import { type ColumnDef, useDataGrid } from '@mui/x-data-grid-headless';
import { sortingPlugin } from '@mui/x-data-grid-headless/plugins/sorting';
import { paginationPlugin } from '@mui/x-data-grid-headless/plugins/pagination';
import {
  virtualizationPlugin,
  type RowToRender,
  type ColumnToRender,
} from '@mui/x-data-grid-headless/plugins/virtualization';

import { ConfigPanel, type PluginConfig } from './ConfigPanel';
import './styles.css';

interface RowData {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  salary: number;
  hireDate: string;
  status: string;
  role: string;
  manager: string;
  team: string;
  office: string;
  yearsExperience: number;
  rating: number;
  projects: number;
  skills: string;
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
  const cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Seattle',
    'Boston',
    'Denver',
  ];
  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Australia'];
  const statuses = ['Active', 'On Leave', 'Remote', 'Hybrid'];
  const roles = ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director'];
  const teams = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
  const offices = ['HQ', 'Branch A', 'Branch B', 'Remote', 'Satellite'];
  const skillsList = ['React', 'Python', 'Java', 'SQL', 'AWS', 'TypeScript', 'Node.js', 'Docker'];

  const allCombinations: RowData[] = [];
  for (let i = 0; i < count; i += 1) {
    const nameIndex = Math.floor(Math.random() * names.length);
    const surnameIndex = Math.floor(Math.random() * surnames.length);
    const departmentIndex = Math.floor(Math.random() * departments.length);
    const age = 20 + Math.floor(Math.random() * 40);
    const managerNameIndex = Math.floor(Math.random() * names.length);
    const managerSurnameIndex = Math.floor(Math.random() * surnames.length);

    allCombinations.push({
      id: i + 1,
      name: `${names[nameIndex]} ${surnames[surnameIndex]}`,
      email: `${names[nameIndex].toLowerCase()}.${surnames[surnameIndex].toLowerCase()}@example.com`,
      age,
      department: departments[departmentIndex],
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: `${Math.floor(Math.random() * 9999) + 1} Main St`,
      city: cities[Math.floor(Math.random() * cities.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      salary: Math.floor(Math.random() * 150000) + 50000,
      hireDate: `${2015 + Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      manager: `${names[managerNameIndex]} ${surnames[managerSurnameIndex]}`,
      team: teams[Math.floor(Math.random() * teams.length)],
      office: offices[Math.floor(Math.random() * offices.length)],
      yearsExperience: Math.floor(Math.random() * 20) + 1,
      rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
      projects: Math.floor(Math.random() * 15) + 1,
      skills: skillsList.slice(0, Math.floor(Math.random() * 4) + 2).join(', '),
    });
  }

  return allCombinations;
}

// Generate sample columns
function generateColumns(): ColumnDef<RowData>[] {
  return [
    { id: 'id', field: 'id' as keyof RowData, header: 'ID', size: 80 },
    { id: 'name', field: 'name' as keyof RowData, header: 'Name', size: 180 },
    { id: 'email', field: 'email' as keyof RowData, header: 'Email', size: 250 },
    { id: 'age', field: 'age' as keyof RowData, header: 'Age', size: 80 },
    { id: 'department', field: 'department' as keyof RowData, header: 'Department', size: 130 },
    { id: 'phone', field: 'phone' as keyof RowData, header: 'Phone', size: 160 },
    { id: 'address', field: 'address' as keyof RowData, header: 'Address', size: 150 },
    { id: 'city', field: 'city' as keyof RowData, header: 'City', size: 120 },
    { id: 'country', field: 'country' as keyof RowData, header: 'Country', size: 100 },
    { id: 'salary', field: 'salary' as keyof RowData, header: 'Salary', size: 100 },
    { id: 'hireDate', field: 'hireDate' as keyof RowData, header: 'Hire Date', size: 120 },
    { id: 'status', field: 'status' as keyof RowData, header: 'Status', size: 100 },
    { id: 'role', field: 'role' as keyof RowData, header: 'Role', size: 110 },
    { id: 'manager', field: 'manager' as keyof RowData, header: 'Manager', size: 160 },
    { id: 'team', field: 'team' as keyof RowData, header: 'Team', size: 100 },
    { id: 'office', field: 'office' as keyof RowData, header: 'Office', size: 100 },
    {
      id: 'yearsExperience',
      field: 'yearsExperience' as keyof RowData,
      header: 'Experience',
      size: 110,
    },
    { id: 'rating', field: 'rating' as keyof RowData, header: 'Rating', size: 80 },
    { id: 'projects', field: 'projects' as keyof RowData, header: 'Projects', size: 90 },
    { id: 'skills', field: 'skills' as keyof RowData, header: 'Skills', size: 200 },
  ];
}

const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 48;

const plugins = [sortingPlugin, paginationPlugin, virtualizationPlugin] as const;
type GridPlugins = typeof plugins;
type GridInstance = ReturnType<typeof useDataGrid<GridPlugins, RowData>>;

interface DataGridContextValue {
  grid: GridInstance;
  config: PluginConfig;
}

const DataGridContext = React.createContext<DataGridContextValue | null>(null);

function useDataGridContext() {
  const context = React.useContext(DataGridContext);
  if (!context) {
    throw new Error('DataGrid components must be used within a DataGridProvider');
  }
  return context;
}

function GridCell({ column, row }: { column: ColumnToRender; row: RowToRender<RowData> }) {
  const value = row.model[column.field as keyof RowData];
  const { grid } = useDataGridContext();
  const cellProps = grid.api.elements.hooks.useCellProps({
    field: column.id,
    colIndex: column.index,
  });

  return (
    <div
      key={column.id}
      className="grid-cell"
      {...cellProps}
      style={{ width: column.size || 150, minWidth: column.size || 150 }}
    >
      {value != null ? String(value) : ''}
    </div>
  );
}

function GridRow({
  row,
  columnsToRender,
}: {
  row: RowToRender<RowData>;
  columnsToRender: ColumnToRender[];
}) {
  const { grid } = useDataGridContext();
  const rowProps = grid.api.elements.hooks.useRowProps({ id: row.id, index: row.index });

  return (
    <div key={row.id} className="grid-row" {...rowProps} style={{ height: ROW_HEIGHT }}>
      {columnsToRender.map((column) => (
        <GridCell column={column} row={row} key={column.id}></GridCell>
      ))}
    </div>
  );
}

function DataGridRenderZone() {
  const { grid } = useDataGridContext();
  const virtualization = grid.api.virtualization;
  const rowsToRender = virtualization.hooks.useRowsToRender<RowData>();
  const columnsToRender = virtualization.hooks.useColumnsToRender();
  const offsetTop = virtualization.hooks.useOffsetTop();
  const offsetLeft = virtualization.hooks.useOffsetLeft();

  return (
    <div
      className="grid-virtualScrollerRenderZone"
      role="rowgroup"
      style={{
        position: 'absolute',
        top: 0,
        left: offsetLeft,
        transform: `translate3d(0, ${offsetTop}px, 0)`,
      }}
    >
      {rowsToRender.map((row) => {
        if (!row) {
          return null;
        }
        return <GridRow key={row.id} row={row} columnsToRender={columnsToRender} />;
      })}
    </div>
  );
}

function DataGridColumnHeaders() {
  const { grid, config } = useDataGridContext();
  const virtualization = grid.api.virtualization;
  const columnsToRender = virtualization.hooks.useColumnsToRender();
  const columnsTotalWidth = virtualization.hooks.useColumnsTotalWidth();
  const offsetLeft = virtualization.hooks.useOffsetLeft();
  const sortModel = grid.use(sortingPlugin.selectors.model);

  const sortColumn = (field: string, shiftKey: boolean) => {
    if (!config.sorting?.enabled) {
      return;
    }
    const requireShiftKey = config.sorting?.multiSortWithShiftKey ?? true;
    const multiSort = config.sorting?.multiSort && (!requireShiftKey || shiftKey);
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

  return (
    <div className="grid-column-headers-container">
      <div
        className="grid-column-headers"
        role="rowgroup"
        style={{ minWidth: columnsTotalWidth, height: HEADER_HEIGHT }}
      >
        <div className="grid-column-headers-content" style={{ left: offsetLeft }}>
          {columnsToRender.map((column) => {
            return (
              // eslint-disable-next-line jsx-a11y/interactive-supports-focus
              <div
                key={column.id}
                role="columnheader"
                onClick={(event) => sortColumn(column.field as string, event.shiftKey)}
                onKeyDown={(event) => sortColumn(column.field as string, event.shiftKey)}
                className="grid-column-header-cell"
                style={{
                  width: column.size || 150,
                  minWidth: column.size || 150,
                  height: HEADER_HEIGHT,
                }}
              >
                {column.header || column.id}
                {config.sorting?.enabled && getSortIcon(column.field as string)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type ScrollbarPosition = 'vertical' | 'horizontal';

function DataGridVirtualScrollbar({
  position,
  hasOppositeScrollbar,
}: {
  position: ScrollbarPosition;
  hasOppositeScrollbar: boolean;
}) {
  const { grid } = useDataGridContext();
  const dimensions = grid.api.virtualization.hooks.useDimensions();

  const isVertical = position === 'vertical';
  const elements = grid.api.elements;
  const scrollbarProps = isVertical
    ? elements.hooks.useScrollbarVerticalProps()
    : elements.hooks.useScrollbarHorizontalProps();

  const contentSize = dimensions.contentSize[isVertical ? 'height' : 'width'];
  const scrollbarSize = dimensions.scrollbarSize;

  const style: React.CSSProperties = isVertical
    ? {
        position: 'absolute',
        top: HEADER_HEIGHT,
        right: 0,
        width: scrollbarSize,
        height: `calc(100% - ${HEADER_HEIGHT}px - ${hasOppositeScrollbar ? scrollbarSize : 0}px)`,
        overflowY: 'auto',
        overflowX: 'hidden',
        outline: 0,
      }
    : {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: `calc(100% - ${hasOppositeScrollbar ? scrollbarSize : 0}px)`,
        height: scrollbarSize,
        overflowY: 'hidden',
        overflowX: 'auto',
        outline: 0,
      };

  const innerStyle: React.CSSProperties = React.useMemo(() => {
    return isVertical
      ? { width: scrollbarSize, height: contentSize }
      : { height: scrollbarSize, width: contentSize };
  }, [isVertical, scrollbarSize, contentSize]);

  return (
    <div {...scrollbarProps} style={style}>
      <div style={innerStyle} />
    </div>
  );
}

type DataGridHandle = GridInstance;

interface DataGridProps {
  rows: RowData[];
  columns: ColumnDef<RowData>[];
  config: PluginConfig;
}

const DataGrid = React.forwardRef<DataGridHandle, DataGridProps>(function DataGrid(
  { rows, columns, config },
  ref,
) {
  const grid = useDataGrid({
    rows,
    columns,
    plugins,
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
          pageSize: config.pagination?.pageSize ?? 100,
        },
      },
    },
  });

  React.useImperativeHandle(ref, () => grid);

  // Sync page size with config changes (including disabling pagination)
  const effectivePageSize = config.pagination?.enabled
    ? (config.pagination?.pageSize ?? 100)
    : Infinity;

  React.useEffect(() => {
    grid.api.pagination.setPageSize(effectivePageSize);
  }, [effectivePageSize, grid]);

  // Use paginated row IDs from pagination plugin
  const paginationModel = grid.use(paginationPlugin.selectors.model);
  const pageCount = grid.use(paginationPlugin.selectors.pageCount);
  const rowCount = grid.use(paginationPlugin.selectors.rowCount);
  const startRow = grid.use(paginationPlugin.selectors.startRow);
  const endRow = grid.use(paginationPlugin.selectors.endRow);

  const virtualization = grid.api.virtualization;
  const elements = grid.api.elements;

  const gridProps = elements.hooks.useGridProps();
  const containerProps = elements.hooks.useContainerProps();
  const scrollerProps = elements.hooks.useScrollerProps();
  const contentProps = elements.hooks.useContentProps();
  const dimensions = virtualization.hooks.useDimensions();

  const hasScrollY = dimensions.hasScrollY;
  const hasScrollX = dimensions.hasScrollX;
  const scrollbarSize = dimensions.scrollbarSize;

  // Scroll to top when page changes
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const mergedScrollerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollContainerRef.current = node;
      const origRef = scrollerProps.ref;
      if (typeof origRef === 'function') {
        origRef(node);
      } else if (origRef) {
        (origRef as React.RefObject<HTMLDivElement | null>).current = node;
      }
    },
    [scrollerProps.ref],
  );

  React.useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }, [paginationModel.page]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).grid = grid;
    }
  }, [grid]);

  const contextValue = React.useMemo(() => ({ grid, config }), [grid, config]);

  return (
    <DataGridContext.Provider value={contextValue}>
      <div className="grid-wrapper">
        <div className="grid-root" {...gridProps}>
          <div className="grid-mainContent" {...containerProps}>
            <div className="grid-virtualScroller" {...scrollerProps} ref={mergedScrollerRef}>
              <DataGridColumnHeaders />
              <div className="grid-virtualScrollerContent" {...contentProps}>
                <DataGridRenderZone />
              </div>
            </div>
          </div>
          {hasScrollX && hasScrollY && (
            <div
              className="grid-scrollbar-corner"
              style={{ width: scrollbarSize, height: scrollbarSize }}
            />
          )}
          {hasScrollY && (
            <DataGridVirtualScrollbar position="vertical" hasOppositeScrollbar={hasScrollX} />
          )}
          {hasScrollX && (
            <DataGridVirtualScrollbar position="horizontal" hasOppositeScrollbar={hasScrollY} />
          )}
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
    </DataGridContext.Provider>
  );
});

function App() {
  const [rows, setRows] = React.useState<RowData[]>(() => generateSampleData(20000));
  const [columns, setColumns] = React.useState(() => generateColumns());
  const [, setCounter] = React.useState(0);
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
      pageSize: 100,
    },
  });

  const gridRef = React.useRef<DataGridHandle>(null);

  const handleApplySorting = () => {
    gridRef.current?.api.sorting.apply();
  };

  const handleRefreshRows = () => {
    setRows(generateSampleData(rows.length));
  };

  const handleRefreshColumns = () => {
    setColumns(shuffleArray(generateColumns()));
  };

  const handleRerender = () => {
    setCounter((prev) => prev + 1);
  };

  return (
    <div className="test-grid-container">
      <DataGrid ref={gridRef} rows={rows} columns={columns} config={config} />
      <ConfigPanel
        config={config}
        onConfigChange={setConfig}
        onApplySorting={handleApplySorting}
        onRerender={handleRerender}
        onRefreshRows={handleRefreshRows}
        onShuffleColumns={handleRefreshColumns}
      />
    </div>
  );
}

export default App;

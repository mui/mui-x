import * as React from 'react';
import { type ColumnDef, useDataGrid } from '@mui/x-data-grid-headless';
import sortingPlugin from '@mui/x-data-grid-headless/plugins/sorting';
import paginationPlugin from '@mui/x-data-grid-headless/plugins/pagination';
import virtualizationPlugin, {
  type RowToRender,
  type ColumnToRender,
} from '@mui/x-data-grid-headless/plugins/virtualization';
// import { useDataGridPro } from '@mui/x-data-grid-headless-pro';
// import { useDataGridPremium } from '@mui/x-data-grid-headless-premium';
import './App.css';

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

// Generate sample columns with random order
function generateColumns() {
  const allColumns: ColumnDef<RowData>[] = [
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

  // Shuffle columns to randomize order
  return allColumns;
}

const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 48;
const SCROLLBAR_SIZE = 14;

const plugins = [sortingPlugin, paginationPlugin, virtualizationPlugin] as const;
type GridPlugins = typeof plugins;
type GridInstance = ReturnType<typeof useDataGrid<GridPlugins, RowData>>;

const DataGridContext = React.createContext<GridInstance | null>(null);

function useDataGridContext() {
  const context = React.useContext(DataGridContext);
  if (!context) {
    throw new Error('DataGrid components must be used within a DataGridProvider');
  }
  return context;
}

function renderCell(column: ColumnToRender, row: RowToRender<RowData>) {
  const value = row.model[column.field as keyof RowData];
  return (
    <div
      key={column.id}
      className="DataGrid-cell"
      role="gridcell"
      style={{
        padding: '12px 16px',
        fontSize: '14px',
        width: column.size || 150,
        minWidth: column.size || 150,
        flexShrink: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {value != null ? String(value) : ''}
    </div>
  );
}

function renderRow(row: RowToRender<RowData>, columnsToRender: ColumnToRender[]) {
  return (
    <div
      key={row.id}
      className="DataGrid-row"
      role="row"
      style={{
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
        height: ROW_HEIGHT,
        boxSizing: 'border-box',
      }}
    >
      {columnsToRender.map((column) => renderCell(column, row))}
    </div>
  );
}

function DataGridRenderZone() {
  const grid = useDataGridContext();
  const virtualization = grid.api.virtualization;
  const rowsToRender = virtualization.hooks.useRowsToRender<RowData>();
  const columnsToRender = virtualization.hooks.useColumnsToRender();
  const offsetTop = virtualization.hooks.useOffsetTop();
  const offsetLeft = virtualization.hooks.useOffsetLeft();
  const renderContext = virtualization.hooks.useRenderContext();

  const renderZoneTop = offsetTop || renderContext.firstRowIndex * ROW_HEIGHT;

  return (
    <div
      className="DataGrid-virtualScrollerRenderZone"
      role="rowgroup"
      style={{
        position: 'absolute',
        top: 0,
        left: offsetLeft,
        transform: `translate3d(0, ${renderZoneTop}px, 0)`,
      }}
    >
      {rowsToRender.map((row) => {
        if (!row) {
          return null;
        }
        return renderRow(row, columnsToRender);
      })}
    </div>
  );
}

function DataGridColumnHeaders() {
  const grid = useDataGridContext();
  const virtualization = grid.api.virtualization;
  const columnsToRender = virtualization.hooks.useColumnsToRender();
  const totalContentSize = virtualization.hooks.useTotalContentSize();
  const scrollPosition = virtualization.hooks.useScrollPosition();
  const offsetLeft = virtualization.hooks.useOffsetLeft();

  return (
    <div
      className="DataGrid-columnHeaders"
      role="rowgroup"
      style={{
        position: 'relative',
        minWidth: totalContentSize.width,
        height: HEADER_HEIGHT,
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #e0e0e0',
        transform: `translate3d(-${scrollPosition.left}px, 0, 0)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: offsetLeft,
        }}
      >
        {columnsToRender.map((column) => (
          <div
            key={column.id}
            role="columnheader"
            style={{
              padding: '12px 16px',
              fontWeight: 600,
              fontSize: '14px',
              width: column.size || 150,
              minWidth: column.size || 150,
              flexShrink: 0,
              boxSizing: 'border-box',
              height: HEADER_HEIGHT,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {column.header || column.id}
          </div>
        ))}
      </div>
    </div>
  );
}

function DataGridScrollbarVertical({
  scrollbarRef,
  hasScrollX,
}: {
  scrollbarRef: React.RefObject<HTMLDivElement | null>;
  hasScrollX: boolean;
}) {
  const grid = useDataGridContext();
  const { hooks } = grid.api.virtualization;
  const scrollbarVerticalProps = hooks.useScrollbarVerticalProps();
  const totalContentSize = hooks.useTotalContentSize();

  return (
    <div
      className="DataGrid-scrollbarVertical"
      {...scrollbarVerticalProps}
      ref={(el) => {
        scrollbarRef.current = el;
        const propsRef = scrollbarVerticalProps.ref;
        if (typeof propsRef === 'function') {
          propsRef(el);
        } else if (propsRef && typeof propsRef === 'object') {
          (propsRef as React.RefObject<HTMLDivElement | null>).current = el;
        }
      }}
      tabIndex={-1}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: HEADER_HEIGHT,
        right: 0,
        width: SCROLLBAR_SIZE,
        height: `calc(100% - ${HEADER_HEIGHT}px - ${hasScrollX ? SCROLLBAR_SIZE : 0}px)`,
        overflowY: 'auto',
        overflowX: 'hidden',
        outline: 0,
      }}
    >
      <div style={{ width: SCROLLBAR_SIZE, height: totalContentSize.height }} />
    </div>
  );
}

function DataGridScrollbarHorizontal({
  scrollbarRef,
  hasScrollY,
}: {
  scrollbarRef: React.RefObject<HTMLDivElement | null>;
  hasScrollY: boolean;
}) {
  const grid = useDataGridContext();
  const { hooks } = grid.api.virtualization;
  const scrollbarHorizontalProps = hooks.useScrollbarHorizontalProps();
  const totalContentSize = hooks.useTotalContentSize();

  return (
    <div
      className="DataGrid-scrollbarHorizontal"
      {...scrollbarHorizontalProps}
      ref={(el) => {
        scrollbarRef.current = el;
        const propsRef = scrollbarHorizontalProps.ref;
        if (typeof propsRef === 'function') {
          propsRef(el);
        } else if (propsRef && typeof propsRef === 'object') {
          (propsRef as React.RefObject<HTMLDivElement | null>).current = el;
        }
      }}
      tabIndex={-1}
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: `calc(100% - ${hasScrollY ? SCROLLBAR_SIZE : 0}px)`,
        height: SCROLLBAR_SIZE,
        overflowY: 'hidden',
        overflowX: 'auto',
        outline: 0,
      }}
    >
      <div style={{ height: SCROLLBAR_SIZE, width: totalContentSize.width }} />
    </div>
  );
}

function DataGrid() {
  const [rows, setRows] = React.useState<RowData[]>(() => generateSampleData(20000));
  const [columns, setColumns] = React.useState(() => generateColumns());

  const [, setCounter] = React.useState(0);

  const grid = useDataGrid({
    rows,
    columns,
    plugins,
  });

  const { hooks } = grid.api.virtualization;

  const containerProps = hooks.useContainerProps();
  const scrollerProps = hooks.useScrollerProps();
  const contentProps = hooks.useContentProps();
  const scrollAreaProps = hooks.useScrollAreaProps();
  const totalContentSize = hooks.useTotalContentSize();
  const dimensions = hooks.useDimensions();

  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const scrollbarVerticalRef = React.useRef<HTMLDivElement>(null);
  const scrollbarHorizontalRef = React.useRef<HTMLDivElement>(null);
  const isScrollLocked = React.useRef(false);

  const hasScrollY = totalContentSize.height > (dimensions.viewportInnerSize.height || 0);
  const hasScrollX = totalContentSize.width > (dimensions.viewportInnerSize.width || 0);

  const handleScrollerScroll = React.useCallback(() => {
    if (isScrollLocked.current) {
      isScrollLocked.current = false;
      return;
    }
    isScrollLocked.current = true;

    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    if (scrollbarVerticalRef.current) {
      scrollbarVerticalRef.current.scrollTop = scroller.scrollTop;
    }
    if (scrollbarHorizontalRef.current) {
      scrollbarHorizontalRef.current.scrollLeft = scroller.scrollLeft;
    }
  }, []);

  const handleScrollbarVerticalScroll = React.useCallback(() => {
    if (isScrollLocked.current) {
      isScrollLocked.current = false;
      return;
    }
    isScrollLocked.current = true;

    const scroller = scrollerRef.current;
    const scrollbar = scrollbarVerticalRef.current;
    if (scroller && scrollbar) {
      scroller.scrollTop = scrollbar.scrollTop;
    }
  }, []);

  const handleScrollbarHorizontalScroll = React.useCallback(() => {
    if (isScrollLocked.current) {
      isScrollLocked.current = false;
      return;
    }
    isScrollLocked.current = true;

    const scroller = scrollerRef.current;
    const scrollbar = scrollbarHorizontalRef.current;
    if (scroller && scrollbar) {
      scroller.scrollLeft = scrollbar.scrollLeft;
    }
  }, []);

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return undefined;
    }

    scroller.addEventListener('scroll', handleScrollerScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', handleScrollerScroll);
    };
  }, [handleScrollerScroll]);

  React.useEffect(() => {
    const scrollbar = scrollbarVerticalRef.current;
    if (!scrollbar) {
      return undefined;
    }

    scrollbar.addEventListener('scroll', handleScrollbarVerticalScroll, { passive: true });
    return () => {
      scrollbar.removeEventListener('scroll', handleScrollbarVerticalScroll);
    };
  }, [handleScrollbarVerticalScroll]);

  React.useEffect(() => {
    const scrollbar = scrollbarHorizontalRef.current;
    if (!scrollbar) {
      return undefined;
    }

    scrollbar.addEventListener('scroll', handleScrollbarHorizontalScroll, { passive: true });
    return () => {
      scrollbar.removeEventListener('scroll', handleScrollbarHorizontalScroll);
    };
  }, [handleScrollbarHorizontalScroll]);

  const handleRefreshRows = () => {
    setRows(generateSampleData(rows.length));
  };

  const handleRefreshColumns = () => {
    setColumns(shuffleArray(generateColumns()));
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).grid = grid;
    }
  }, [grid]);

  return (
    <DataGridContext.Provider value={grid}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              setCounter((prev) => prev + 1);
            }}
            className="button"
          >
            Rerender
          </button>
          <button type="button" onClick={handleRefreshRows} className="button">
            Refresh Rows
          </button>
          <button type="button" onClick={handleRefreshColumns} className="button">
            Shuffle Columns
          </button>
        </div>

        <div
          className="DataGrid-root"
          style={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: 'white',
            height: '600px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            className="DataGrid-mainContent"
            {...containerProps}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <DataGridColumnHeaders />
            <div
              className="DataGrid-virtualScroller"
              {...scrollerProps}
              ref={(el) => {
                scrollerRef.current = el;
                const propsRef = scrollerProps.ref;
                if (typeof propsRef === 'function') {
                  propsRef(el);
                } else if (propsRef && typeof propsRef === 'object') {
                  (propsRef as React.RefObject<HTMLDivElement | null>).current = el;
                }
              }}
              style={{
                ...scrollerProps.style,
                flex: 1,
                overflow: 'auto',
              }}
            >
              <div
                className="DataGrid-virtualScrollerContent"
                {...contentProps}
                style={{
                  ...contentProps.style,
                  width: totalContentSize.width,
                  position: 'relative',
                }}
              >
                <DataGridRenderZone />
              </div>
            </div>
          </div>
          {hasScrollX && hasScrollY && (
            <div
              className="DataGrid-scrollArea"
              {...scrollAreaProps}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: SCROLLBAR_SIZE,
                height: SCROLLBAR_SIZE,
                backgroundColor: '#f5f5f5',
              }}
            />
          )}
          {hasScrollY && (
            <DataGridScrollbarVertical
              scrollbarRef={scrollbarVerticalRef}
              hasScrollX={hasScrollX}
            />
          )}
          {hasScrollX && (
            <DataGridScrollbarHorizontal
              scrollbarRef={scrollbarHorizontalRef}
              hasScrollY={hasScrollY}
            />
          )}
        </div>
      </div>
    </DataGridContext.Provider>
  );
}

function App() {
  return (
    <div className="app">
      <DataGrid />
    </div>
  );
}

export default App;

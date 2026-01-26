import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
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
      // TODO: should come from the Elements API
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

  return (
    <div
      className="DataGrid-virtualScrollerRenderZone"
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

type ScrollbarPosition = 'vertical' | 'horizontal';

interface DataGridVirtualScrollbarProps {
  position: ScrollbarPosition;
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  hasOppositeScrollbar: boolean;
}

function DataGridVirtualScrollbar({
  position,
  scrollerRef,
  hasOppositeScrollbar,
}: DataGridVirtualScrollbarProps) {
  const grid = useDataGridContext();
  const dimensions = grid.api.virtualization.hooks.useDimensions();

  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const isLocked = React.useRef(false);
  const lastPosition = React.useRef(0);

  const isVertical = position === 'vertical';
  const scrollbarProps = isVertical
    ? grid.api.virtualization.hooks.useScrollbarVerticalProps()
    : grid.api.virtualization.hooks.useScrollbarHorizontalProps();

  const handleScrollbarRef = useForkRef(scrollbarRef, scrollbarProps.ref);

  const propertyScroll = isVertical ? 'scrollTop' : 'scrollLeft';
  const contentSize = dimensions.contentSize[isVertical ? 'height' : 'width'];

  const handleScrollerScroll = React.useCallback(() => {
    const scroller = scrollerRef.current;
    const scrollbar = scrollbarRef.current;
    if (!scroller || !scrollbar) {
      return;
    }

    const scrollerPosition = scroller[propertyScroll];
    if (scrollerPosition === lastPosition.current) {
      return;
    }
    lastPosition.current = scrollerPosition;

    if (isLocked.current) {
      isLocked.current = false;
      return;
    }
    isLocked.current = true;

    scrollbar[propertyScroll] = scrollerPosition;
  }, [scrollerRef, propertyScroll]);

  const handleScrollbarScroll = React.useCallback(() => {
    const scroller = scrollerRef.current;
    const scrollbar = scrollbarRef.current;
    if (!scroller || !scrollbar) {
      return;
    }

    if (isLocked.current) {
      isLocked.current = false;
      return;
    }
    isLocked.current = true;

    scroller[propertyScroll] = scrollbar[propertyScroll];
  }, [scrollerRef, propertyScroll]);

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    const scrollbar = scrollbarRef.current;
    if (!scroller || !scrollbar) {
      return undefined;
    }

    const options: AddEventListenerOptions = { passive: true };
    scroller.addEventListener('scroll', handleScrollerScroll, options);
    scrollbar.addEventListener('scroll', handleScrollbarScroll, options);

    return () => {
      scroller.removeEventListener('scroll', handleScrollerScroll);
      scrollbar.removeEventListener('scroll', handleScrollbarScroll);
    };
  }, [handleScrollerScroll, handleScrollbarScroll, scrollerRef]);

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

  const innerStyle: React.CSSProperties = isVertical
    ? { width: scrollbarSize, height: contentSize }
    : { height: scrollbarSize, width: contentSize };

  return (
    <div
      className={`DataGrid-scrollbar${isVertical ? 'Vertical' : 'Horizontal'}`}
      {...scrollbarProps}
      ref={handleScrollbarRef}
      tabIndex={-1}
      aria-hidden="true"
      style={style}
    >
      <div style={innerStyle} />
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

  const virtualization = grid.api.virtualization;

  const containerProps = virtualization.hooks.useContainerProps();
  const scrollerProps = virtualization.hooks.useScrollerProps();
  const contentProps = virtualization.hooks.useContentProps();
  const scrollAreaProps = virtualization.hooks.useScrollAreaProps();
  const totalContentSize = virtualization.hooks.useTotalContentSize();
  const dimensions = virtualization.hooks.useDimensions();

  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const handleScrollerRef = useForkRef(scrollerRef, scrollerProps.ref);

  const hasScrollY = dimensions.hasScrollY;
  const hasScrollX = dimensions.hasScrollX;
  const scrollbarSize = dimensions.scrollbarSize;

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
              ref={handleScrollerRef}
              style={{
                ...(scrollerProps.style as React.CSSProperties),
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
                  height: dimensions.rowsMeta.currentPageTotalHeight,
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
                width: scrollbarSize,
                height: scrollbarSize,
                backgroundColor: '#f5f5f5',
              }}
            />
          )}
          {hasScrollY && (
            <DataGridVirtualScrollbar
              position="vertical"
              scrollerRef={scrollerRef}
              hasOppositeScrollbar={hasScrollX}
            />
          )}
          {hasScrollX && (
            <DataGridVirtualScrollbar
              position="horizontal"
              scrollerRef={scrollerRef}
              hasOppositeScrollbar={hasScrollY}
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

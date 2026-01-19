import * as React from 'react';
import { useDataGrid } from '@mui/x-data-grid-headless';
import { StoreInspector, useStore } from '@base-ui/utils/store';
import sortingPlugin from '@mui/x-data-grid-headless/plugins/sorting';
import paginationPlugin from '@mui/x-data-grid-headless/plugins/pagination';
// import { useDataGridPro } from '@mui/x-data-grid-headless-pro';
// import { useDataGridPremium } from '@mui/x-data-grid-headless-premium';
import './App.css';

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
  const allColumns = [
    { id: 'id', field: 'id' as keyof RowData, header: 'ID', width: 80 },
    { id: 'name', field: 'name' as keyof RowData, header: 'Name', width: 200 },
    { id: 'email', field: 'email' as keyof RowData, header: 'Email', width: 250 },
    { id: 'age', field: 'age' as keyof RowData, header: 'Age', width: 100 },
    { id: 'department', field: 'department' as keyof RowData, header: 'Department', width: 150 },
  ];

  // Shuffle columns to randomize order
  return shuffleArray(allColumns);
}

function DataGrid() {
  const [rows, setRows] = React.useState<RowData[]>(() => generateSampleData(30));
  const [columns, setColumns] = React.useState(() => generateColumns());

  const [, setCounter] = React.useState(0);

  const grid = useDataGrid({
    rows,
    columns,
    plugins: [sortingPlugin, paginationPlugin],
  });

  const rowIds = useStore(grid.store, grid.api.rows.selectors.rowIds);
  const rowsData = useStore(grid.store, grid.api.rows.selectors.rowIdToModelLookup);
  const visibleColumns = useStore(grid.store, grid.api.columns.selectors.visibleColumns);

  const handleRefreshRows = () => {
    setRows(generateSampleData(30));
  };

  const handleRefreshColumns = () => {
    setColumns(generateColumns());
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).grid = grid;
    }
  }, [grid]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }}>
        <StoreInspector store={grid.store} />
      </div>
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
          Refresh Columns
        </button>
      </div>
      <div
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '600px',
          backgroundColor: 'white',
        }}
      >
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
              const row = rowsData[rowId] as RowData | undefined;
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
                  {visibleColumns.map((column: (typeof visibleColumns)[0]) => {
                    const value = row[column.field as keyof RowData];
                    return (
                      <td
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
      </div>
    </div>
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

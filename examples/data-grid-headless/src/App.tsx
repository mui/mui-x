import * as React from 'react';
import { useDataGrid } from '@mui/x-data-grid-headless';
import sortingPlugin from '@mui/x-data-grid-headless/plugins/sorting';
import paginationPlugin from '@mui/x-data-grid-headless/plugins/pagination';
// import { useDataGridPro } from '@mui/x-data-grid-headless-pro';
// import { useDataGridPremium } from '@mui/x-data-grid-headless-premium';
import './App.css';

function DataGrid() {
  const grid = useDataGrid({
    data: [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'John Smith' },
    ],
    columns: [],
    plugins: [sortingPlugin, paginationPlugin],
  });
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).grid = grid;
    }
  }, [grid]);
  return <div>DataGrid</div>;
}

function App() {
  return (
    <div className="app">
      <DataGrid />
    </div>
  );
}

export default App;

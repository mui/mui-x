import { useDataGrid } from '@mui/x-data-grid-core';
// import { useDataGridPro } from '@mui/x-data-grid-core-pro';
// import { useDataGridPremium } from '@mui/x-data-grid-core-premium';
import './App.css';

function DataGrid() {
  useDataGrid();
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

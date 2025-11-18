import { useDataGrid } from '@mui/x-data-grid-headless';
// import { useDataGridPro } from '@mui/x-data-grid-headless-pro';
// import { useDataGridPremium } from '@mui/x-data-grid-headless-premium';
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

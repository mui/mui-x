import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

function App() {
  const [rowSelectionModel, setRowSelectionModel] = useState([1, 2, 'auto-generated-id-1']);
  const [rowSelectionModel2, setRowSelectionModel2] = React.useState([3, 4, 'auto-generated-id-7']);
  const [rowSelectionModel3, setRowSelectionModel3] = React.useMemo(() => [5, 6, 'auto-generated-id-8'], []);
  const [rowSelectionModel4, setRowSelectionModel4] = React.useMemo(() => [7, 8, 'auto-generated-id-9'], []);
  return (
    <React.Fragment>
      <DataGrid
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
      />
      <DataGridPro
        rowSelectionModel={rowSelectionModel2}
        onRowSelectionModelChange={setRowSelectionModel2}
      />
      <DataGridPremium
        rowSelectionModel={rowSelectionModel3}
        onRowSelectionModelChange={setRowSelectionModel3}
      />
    </React.Fragment>
  );
}

export default App;

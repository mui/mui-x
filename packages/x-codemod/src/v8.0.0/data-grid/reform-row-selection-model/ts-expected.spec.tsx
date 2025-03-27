// @ts-nocheck
import * as React from 'react';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

// prettier-ignore
function App() {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set([1, 2, 'auto-generated-id-1']),
  });
  const [rowSelectionModel2, setRowSelectionModel2] = React.useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set([3, 4, 'auto-generated-id-7']),
  });
  const [rowSelectionModel3, setRowSelectionModel3] = React.useMemo<GridRowSelectionModel>(() => ({
    type: 'include',
    ids: new Set([5, 6, 'auto-generated-id-8']),
  }), []);
  const [rowSelectionModel4, setRowSelectionModel4] = React.useMemo<GridRowSelectionModel>(() => [7, 8, 'auto-generated-id-9'], []);
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

import * as React from 'react'
import { DataGrid, dataGridClasses } from '@mui/x-data-grid';

function App () { 
  return (
    <DataGrid
      sx={{
        [`& .${dataGridClasses.cell}`]: {
          overflow: 'hidden',
        },
        [`& .${dataGridClasses.columnHeader}`]: {
          width: 'auto',
        },
      }}
    />
  );
}

export default App

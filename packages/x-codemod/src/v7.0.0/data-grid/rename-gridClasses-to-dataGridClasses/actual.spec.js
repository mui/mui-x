import * as React from 'react'
import { DataGrid, gridClasses } from '@mui/x-data-grid';

function App () { 
  return (
    <DataGrid
      sx={{
        [`& .${gridClasses.cell}`]: {
          overflow: 'hidden',
        },
        [`& .${gridClasses.columnHeader}`]: {
          width: 'auto',
        },
      }}
    />
  );
}

export default App

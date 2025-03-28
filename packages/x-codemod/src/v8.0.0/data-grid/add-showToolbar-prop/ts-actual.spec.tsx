// @ts-nocheck
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MyCustomToolbar from 'some-awesome-library';

function GridToolbar() {
  return <MyCustomToolbar />;
}
// prettier-ignore
function App() {
  return (
    <DataGrid
      slots={{
        toolbar: GridToolbar,
      }}
    />
  );
}

export default App;

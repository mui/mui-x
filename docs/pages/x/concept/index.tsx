import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DataGridPremium as DataGrid, GridToolbar } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGridConcept } from '@mui/x-data-grid';

function useConstantData() {
  return useDemoData({
    dataSet: 'Employee',
    rowLength: 100_000,
  })
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const rowHeight = 36

export default function BasicExampleDataGrid() {
  const [debug, setDebug] = React.useState(true);
  const { data } = useConstantData();
  const columnsSimplified =
    data.columns
      .map(c => ({
        ...c,
        width: 120,
        valueGetter: undefined,
        valueFormatter: ({value}: any) => String(value),
        renderCell: undefined
      }))
      .filter(c => !c.hide)
  const columns = [
    ...columnsSimplified,
    ...columnsSimplified,
    ...columnsSimplified,
    ...columnsSimplified,
  ]
  const props = { ...data, columns }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <div>
          <div>
            <button onClick={() => setDebug(!debug)}>
              Debug mode: {String(debug)}
            </button>
          </div>
          <br/>
          {
            <div key={String(debug)}>
              <DataGridConcept
                {...props}
                debug={debug}
                rowHeight={rowHeight}
              />
            </div>
          }
          <br/>
          <br/>
          {
            // <div style={{ height: 300, width: '100%' }}>
            //   <DataGrid
            //     {...props}
            //     rowHeight={rowHeight}
            //   />
            // </div>
          }
        </div>
    </ThemeProvider>
  );
}

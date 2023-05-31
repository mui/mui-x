import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DataGridPremium as DataGrid, GridToolbar } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid as DataGridConcept } from '../../src/modules/components/concept/DataGrid'

function useConstantData() {
  return useDemoData({
    dataSet: 'Employee',
    rowLength: 100_000,
  })
}
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const rowHeight = 36

export default function BasicExampleDataGrid() {
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
            <DataGridConcept
              {...props}
              rowHeight={rowHeight}
            />
          </div>
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

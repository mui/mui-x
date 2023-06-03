import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DataGridPremium as DataGrid, GridToolbar } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid as DataGridConcept } from './DataGrid';

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

enum Mode { DEBUG, NO_DEBUG, ORIGINAL };

export function Example() {
  const [mode, setMode] = React.useState(Mode.DEBUG);
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
            <button onClick={() => setMode(Mode.DEBUG)}>
              Debug mode [{mode === Mode.DEBUG ? 'x' : ' '}]
            </button>{' '}
            <button onClick={() => setMode(Mode.NO_DEBUG)}>
              Prod mode [{mode === Mode.NO_DEBUG ? 'x' : ' '}]
            </button>{' '}
            <button onClick={() => setMode(Mode.ORIGINAL)}>
              Original DataGrid [{mode === Mode.ORIGINAL ? 'x' : ' '}]
            </button>
          </div>
          <br/>
          {
            mode === Mode.DEBUG &&
              <div key={String(mode)}>
                <DataGridConcept
                  {...props}
                  debug={true}
                  rowHeight={rowHeight}
                />
              </div>
          }
          {
            mode === Mode.NO_DEBUG &&
              <div key={String(mode)}>
                <DataGridConcept
                  {...props}
                  debug={false}
                  rowHeight={rowHeight}
                />
              </div>
          }
          {
            mode === Mode.ORIGINAL &&
              <div key={String(mode)} style={{ height: 300, width: 700 }}>
                <DataGrid
                  {...props}
                  rowHeight={rowHeight}
                />
              </div>
          }
          <br/>
          <br/>
          {
          }
        </div>
    </ThemeProvider>
  );
}

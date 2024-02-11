import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import * as React from 'react';
import { NoSsr } from '@mui/material';
import {
  DataGridPremium as DataGrid,
  DataGridPremiumProps as DataGridProps,
  GridApi,
  GridToolbar,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { useDemoData, useBasicDemoData, getBasicGridData } from '@mui/x-data-grid-generator';

const g = typeof window !== 'undefined' ? window as any : {} as any

const e = console.error
console.error = (...args) => {
  // if (args.some(a => typeof a === 'string' && a.includes('type is invalid')))
  //   debugger
  e.call(console, args)
}

function useConstantData() {
  const top = 2
  const bottom = 2

  const maxColumns = 20

  // const rowLength = 6
  // const rowLength = 200
  const rowLength = 10_000

  const result = useDemoData({
    dataSet: 'Commodity',
    rowLength,
  })

  return React.useMemo(() => {
    const columns = result.data.columns.slice(0, maxColumns)
    const topRows = result.data.rows.slice(0, top)
    const bottomRows = result.data.rows.slice(-1 - bottom, -1)
    const rows = result.data.rows.slice(top, -1 - bottom)
    const data = {
      ...result.data,
      rows,
      columns,
      pinnedRows: {
        top: topRows,
        bottom: bottomRows,
      },
      pinnedColumns: {
        left:  [
          // '__check__',
          // 'desk',
          // columns.at(3)!.field,
        ],
        right: [
          // columns.at(4)!.field,
          // columns.at(-1)!.field,
        ],
      },
      initialState: {
        // rowGrouping: {
        //   model: ['commodity'],
        // },
      },
      // rowReordering: true,
      experimentalFeatures: { columnGrouping: true },
      columnGroupingModel: [
        {
          groupId: 'Group',
          children: [
            { field: 'desk' },
            { field: 'commodity' },
          ],
        },
      ],
    }
    return {
      ...result,
      data,
    }
  }, [result, rowLength, maxColumns, top, bottom])
}

const getDetailPanelHeight = () => 100
const getDetailPanelContent: DataGridProps['getDetailPanelContent'] = ({ row }) =>
  <div>
    <div>Detail panel: {row.id}</div>
    <div style={{ width: '100%', border: '1px solid red' }}>content</div>
  </div>

function Benchmark() {
  const apiRef = useGridApiRef();
  const { data, loading } = useConstantData();

  g.api = apiRef.current

  return (
    <NoSsr>
      <div style={{ height: 602, width: 802 }}>
        { /* @ts-ignore */ }
        <DataGrid
          apiRef={apiRef}
          {...data}
          loading={loading}
          headerFilters={true}
          // checkboxSelection={true}
          showCellVerticalBorder={false}
          columnHeaderHeight={50}
          rowHeight={50}
          hideFooter={true}
          // getDetailPanelHeight={getDetailPanelHeight}
          // getDetailPanelContent={getDetailPanelContent}
        />
      </div>
    </NoSsr>
  );
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#232323',
    },
  },
})

export default function Page(props: any) {
  if (globalThis.document) {
    document.body.style.colorScheme = theme.palette.mode
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{padding: '2em'}}>
        <Benchmark {...props} />
      </div>
    </ThemeProvider>
  )
}

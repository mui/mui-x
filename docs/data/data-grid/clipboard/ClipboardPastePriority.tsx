import * as React from 'react';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import Link from '@mui/material/Link';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: '',
    width: 30,
    minWidth: 30,
    sortable: false,
    filterable: false,
    hideable: false,
  },
  {
    field: 'selection',
    width: 150,
    headerName: 'Selection state',
    sortable: false,
    filterable: false,
    hideable: false,
    renderCell: (params) => {
      if (params.value === selectionTypes.rangeOfCells) {
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{params.value}</div>
            <Link target="_blank" href="/x/react-data-grid/cell-selection/">
              Cell selection
              <span className="plan-premium" title="Premium plan" />
            </Link>
          </div>
        );
      }
      if (params.value === selectionTypes.rangeOfRows) {
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{params.value}</div>
            <Link target="_blank" href="/x/react-data-grid/row-selection/">
              Row selection
            </Link>
          </div>
        );
      }
      return <div style={{ fontWeight: 500 }}>{params.value}</div>;
    },
  },
  {
    field: 'singleRowSingleCell',
    flex: 1,
    headerName: 'A single cell',
    sortable: false,
    filterable: false,
    hideable: false,
    colSpan: (params) => {
      if (params.row.id === 2) {
        return 2;
      }
      return 1;
    },
  },
  {
    field: 'singleRowMultipleCells',
    flex: 1,
    headerName: 'Single row with multiple cells',
    sortable: false,
    filterable: false,
    hideable: false,
    colSpan: (params) => {
      if (params.row.id === 1 || params.row.id === 3) {
        return 2;
      }
      return 1;
    },
  },
  {
    field: 'multipleRows',
    flex: 1,
    headerName: 'Multiple rows',
    sortable: false,
    filterable: false,
    hideable: false,
  },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'Clipboard pasted data',
    headerAlign: 'center',
    children: [
      { field: 'singleRowSingleCell' },
      {
        field: 'singleRowMultipleCells',
      },
      {
        field: 'multipleRows',
      },
    ],
  },
];

const selectionTypes = {
  singleCell: 'Single cell',
  rangeOfCells: 'More than one cell',
  rangeOfRows: 'One or more rows',
};

const rows = [
  {
    id: 1,
    selection: selectionTypes.rangeOfCells,
    singleRowSingleCell: 'The cell value is pasted into each selected cell.',
    singleRowMultipleCells:
      'Cell values are pasted starting from the first selected cell.\nCells outside of the selection are not impacted.',
    multipleRows: '---',
  },
  {
    id: 2,
    selection: selectionTypes.rangeOfRows,
    singleRowSingleCell:
      'The row data is pasted into each selected row.\nRows outside of the selection are not impacted.',
    singleRowMultipleCells: '---',
    multipleRows:
      'Rows are pasted into selected rows starting from the first selected row.\nRows outside of the selection are not impacted.',
  },
  {
    id: 3,
    selection: selectionTypes.singleCell,
    singleRowSingleCell: 'The cell value is pasted into the selected cell.',
    singleRowMultipleCells:
      'Cells values are pasted starting from the selected cell.\nCells outside of the selection might be impacted.',
    multipleRows: '---',
  },
];

export default function ClipboardPastePriority() {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        getRowHeight={() => 'auto'}
        autoHeight
        sx={{
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '8px' },
          '& .MuiDataGrid-cell': {
            whiteSpace: 'break-spaces',
          },
        }}
        disableColumnMenu
        hideFooter
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={columnGroupingModel}
        showCellVerticalBorder
        disableRowSelectionOnClick
      />
    </div>
  );
}

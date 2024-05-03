import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import IconButton from '@mui/material/IconButton';
import LinkIcon from '@mui/icons-material/Link';

const columns = [
  { field: 'feature', headerName: 'Feature', renderCell: BoldText, minWidth: 120 },
  {
    field: 'flag',
    headerName: 'Flag in GridColDef',
    renderCell: Code,
    minWidth: 130,
  },
  {
    field: 'disableGridProp',
    headerName: 'Disable grid prop',
    renderCell: Code,
    minWidth: 200,
  },
  {
    field: 'propsToControlProgrammatically',
    headerName: 'Props to control programmatically',
    minWidth: 300,
    display: 'flex',
    renderCell: List,
  },
  {
    field: 'apiMethodToControlProgrammatically',
    headerName: 'API Method to control programmatically',
    renderCell: Code,
    minWidth: 300,
  },
  {
    field: 'docs',
    headerName: 'Docs',
    renderCell: DocsLink,
    width: 61,
    disableColumnMenu: true,
    sortable: false,
    resizable: false,
  },
];

const rows = [
  {
    id: 1,
    feature: 'Hiding',
    flag: 'hideable',
    disableGridProp: 'disableColumnSelector',
    propsToControlProgrammatically:
      'columnVisibilityModel, initialState.columns.columnVisibilityModel',
    apiMethodToControlProgrammatically: 'setColumnVisibilityModel',
    docs: '/x/react-data-grid/column-visibility/',
  },
  {
    id: 2,
    feature: 'Sorting',
    flag: 'sortable',
    disableGridProp: 'disableColumnSorting',
    propsToControlProgrammatically: 'sortModel, initialState.sorting.sortModel',
    apiMethodToControlProgrammatically: 'setSortModel',
    docs: '/x/react-data-grid/sorting/#sorting-non-sortable-columns-programmatically',
  },
  {
    id: 3,
    feature: 'Filtering',
    flag: 'filterable',
    disableGridProp: 'disableColumnFilter',
    propsToControlProgrammatically: 'filterModel, initialState.filter.filterModel',
    apiMethodToControlProgrammatically: 'setFilterModel',
    docs: '/x/react-data-grid/filtering/#filter-non-filterable-columns-programmatically',
  },
  {
    id: 4,
    feature: 'Autosizing',
    flag: 'resizable',
    disableGridProp: 'disableAutosize',
    propsToControlProgrammatically: 'autosizeOnMount',
    apiMethodToControlProgrammatically: 'autosizeColumns',
    docs: '/x/react-data-grid/column-dimensions/#autosizing',
  },
  {
    id: 5,
    feature: 'Column pinning',
    flag: 'pinnable',
    disableGridProp: 'disableColumnPinning',
    propsToControlProgrammatically: 'pinnedColumns, initialState.pinnedColumns',
    apiMethodToControlProgrammatically: 'setPinnedColumns',
    docs: '/x/react-data-grid/column-pinning/#pin-non-pinnable-columns-programmatically',
  },
  {
    id: 6,
    feature: 'Row grouping',
    flag: 'groupable',
    disableGridProp: 'disableRowGrouping',
    propsToControlProgrammatically:
      'rowGroupingModel, initialState.rowGrouping.model',
    apiMethodToControlProgrammatically: 'setRowGroupingModel',
    docs: '/x/react-data-grid/row-grouping/#grouping-non-groupable-columns-programmatically',
  },
  {
    id: 7,
    feature: 'Aggregation',
    flag: 'aggregable',
    disableGridProp: 'disableAggregation',
    propsToControlProgrammatically:
      'aggregationModel, initialState.aggregation.model',
    apiMethodToControlProgrammatically: 'setAggregationModel',
    docs: '/x/react-data-grid/row-grouping/#grouping-non-groupable-columns-programmatically',
  },
];

export default function ColDefChangesGridNoSnap() {
  return (
    <div style={{ width: '100%' }}>
      <DataGridPremium
        hideFooter
        disableColumnMenu
        autoHeight
        columns={columns}
        rows={rows}
        initialState={{ pinnedColumns: { left: ['feature'], right: ['docs'] } }}
      />
    </div>
  );
}

function DocsLink(params) {
  return (
    <IconButton href={params.value} target="_blank">
      <LinkIcon />
    </IconButton>
  );
}

function BoldText(params) {
  return <b>{params.value}</b>;
}

function Code(params) {
  return <code>{params.value}</code>;
}

function List(params) {
  return (
    <ul style={{ paddingLeft: 5 }}>
      {params.value.split(', ').map((v) => (
        <li key={v}>
          <code>{v}</code>
        </li>
      ))}
    </ul>
  );
}

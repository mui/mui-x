import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import {
  DataGridPro,
  GridColDef,
  GridRowsProp,
  GridRowParams,
  useGridApiContext,
  useGridSelector,
  gridDetailPanelExpandedRowIdsSelector,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  gridDetailPanelExpandedRowsContentCacheSelector,
  GridRowId,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomCurrency,
  randomEmail,
  randomPrice,
} from '@mui/x-data-grid-generator';

export default function DetailPanelExpandCollapseAll() {
  const getDetailPanelContent = React.useCallback(
    ({ row }: GridRowParams) => <Box sx={{ p: 2 }}>{`Order #${row.id}`}</Box>,
    [],
  );

  const getDetailPanelHeight = React.useCallback(() => 50, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={getDetailPanelHeight}
      />
    </div>
  );
}

function CustomDetailPanelHeader() {
  const apiRef = useGridApiContext();
  const expandedRowIds = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowIdsSelector,
  );
  const rowsWithDetailPanels = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsContentCacheSelector,
  );

  // little hack to always receive the keys in the correct type
  const allRowIdsWithDetailPanels: GridRowId[] = Object.keys(
    rowsWithDetailPanels,
  ).map((key) => (Number.isNaN(+key) ? key : +key));

  const noDetailPanelsOpen = expandedRowIds.length === 0;

  const expandOrCollapseAll = () => {
    apiRef.current.setExpandedDetailPanels(
      noDetailPanelsOpen ? allRowIdsWithDetailPanels : [],
    );
  };

  return (
    <IconButton
      size="small"
      tabIndex={-1}
      onClick={expandOrCollapseAll}
      aria-label={'Close All'}
    >
      {noDetailPanelsOpen ? (
        <UnfoldMoreIcon fontSize="inherit" />
      ) : (
        <UnfoldLessIcon fontSize="inherit" />
      )}
    </IconButton>
  );
}

const columns: GridColDef[] = [
  {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    renderHeader: () => <CustomDetailPanelHeader />,
  },
  { field: 'id', headerName: 'Order ID' },
  { field: 'customer', headerName: 'Customer', width: 200 },
  { field: 'date', type: 'date', headerName: 'Placed at' },
  { field: 'currency', headerName: 'Currency' },
  { field: 'total', type: 'number', headerName: 'Total' },
];

const rows: GridRowsProp = [
  {
    id: 1,
    customer: 'Matheus',
    email: randomEmail(),
    date: randomCreatedDate(),
    currency: randomCurrency(),
    total: randomPrice(1, 1000),
  },
  {
    id: 2,
    customer: 'Olivier',
    email: randomEmail(),
    date: randomCreatedDate(),
    currency: randomCurrency(),
    total: randomPrice(1, 1000),
  },
  {
    id: 3,
    customer: 'Flavien',
    email: randomEmail(),
    date: randomCreatedDate(),
    currency: randomCurrency(),
    total: randomPrice(1, 1000),
  },
  {
    id: 4,
    customer: 'Danail',
    email: randomEmail(),
    date: randomCreatedDate(),
    currency: randomCurrency(),
    total: randomPrice(1, 1000),
  },
  {
    id: 5,
    customer: 'Alexandre',
    email: randomEmail(),
    date: randomCreatedDate(),
    currency: randomCurrency(),
    total: randomPrice(1, 1000),
  },
];

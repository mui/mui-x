import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  useGridRootProps,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomCurrency,
  randomEmail,
  randomPrice,
} from '@mui/x-data-grid-generator';

export default function CustomizeDetailPanelToggle() {
  const getDetailPanelContent = React.useCallback(
    ({ row }) =>
      row.id % 2 === 0 ? <Box sx={{ p: 2 }}>{`Order #${row.id}`}</Box> : null,
    [],
  );

  const getDetailPanelHeight = React.useCallback(() => 50, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        slots={{
          detailPanelsToggle: CustomDetailPanelsToggle,
        }}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={getDetailPanelHeight}
      />
    </div>
  );
}

function CustomDetailPanelsToggle(props) {
  const { hasContent, isExpanded } = props;
  const rootProps = useGridRootProps();

  if (!hasContent) {
    return null;
  }

  const Icon = isExpanded
    ? rootProps.slots.detailPanelCollapseIcon
    : rootProps.slots.detailPanelExpandIcon;

  const ariaLabel = isExpanded ? 'Collapse detail panel' : 'Expand detail panel';

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        placeItems: 'center',
        placeContent: 'center',
        height: '100%',
      }}
    >
      <rootProps.slots.baseIconButton aria-label={ariaLabel}>
        <Icon fontSize="small" />
      </rootProps.slots.baseIconButton>
    </Box>
  );
}

const columns = [
  { field: 'id', headerName: 'Order ID' },
  { field: 'customer', headerName: 'Customer', width: 200 },
  { field: 'date', type: 'date', headerName: 'Placed at' },
  { field: 'currency', headerName: 'Currency' },
  { field: 'total', type: 'number', headerName: 'Total' },
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
];

const rows = [
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

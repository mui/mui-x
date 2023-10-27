import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  DataGridProProps,
  GridRowsProp,
  GridRowId,
  GridColDef,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomCurrency,
  randomEmail,
  randomPrice,
} from '@mui/x-data-grid-generator';

const getDetailPanelContent: DataGridProProps['getDetailPanelContent'] = ({
  row,
}) => <Box sx={{ p: 2 }}>{`Order #${row.id}`}</Box>;
const getDetailPanelHeight: DataGridProProps['getDetailPanelHeight'] = () => 50;

export default function DetailPanelOneExpandedRow() {
  const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = React.useState<
    GridRowId[]
  >([]);

  const handleDetailPanelExpandedRowIdsChange = React.useCallback(
    (newIds: GridRowId[]) => {
      setDetailPanelExpandedRowIds(
        newIds.length > 1 ? [newIds[newIds.length - 1]] : newIds,
      );
    },
    [],
  );

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelExpandedRowIds={detailPanelExpandedRowIds}
        onDetailPanelExpandedRowIdsChange={handleDetailPanelExpandedRowIdsChange}
      />
    </Box>
  );
}

const columns: GridColDef[] = [
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

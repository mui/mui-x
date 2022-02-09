import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  GridColumns,
  GridRowsProp,
  GridRowId,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomCurrency,
  randomEmail,
  randomPrice,
} from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';

export default function ControlMasterDetail() {
  const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = React.useState<
    GridRowId[]
  >([]);

  const handleDetailPanelExpandedRowIdsChange = React.useCallback(
    (newIds: GridRowId[]) => {
      setDetailPanelExpandedRowIds(newIds);
    },
    [],
  );

  return (
    <div style={{ width: '100%' }}>
      <Alert severity="info" style={{ marginBottom: 8 }}>
        <code>
          detailPanelExpandedRowIds: {JSON.stringify(detailPanelExpandedRowIds)}
        </code>
      </Alert>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          rowThreshold={0}
          getDetailPanelContent={({ row }) => (
            <Box sx={{ p: 2 }}>{`Order #${row.id}`}</Box>
          )}
          getDetailPanelHeight={() => 50}
          detailPanelExpandedRowIds={detailPanelExpandedRowIds}
          onDetailPanelExpandedRowIdsChange={handleDetailPanelExpandedRowIdsChange}
        />
      </div>
    </div>
  );
}

const columns: GridColumns = [
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

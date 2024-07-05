import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import {
  randomEmail,
  randomInt,
  randomCommodity,
  randomPrice,
  randomTraderName,
  randomId,
} from '@mui/x-data-grid-generator';
import { DataGridProps } from '@mui/x-data-grid';

async function getProducts(orderId: Customer['id']) {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  const quantity = randomInt(1, 5);
  return [...Array(quantity)].map((_, index) => ({
    id: index,
    orderId,
    name: randomCommodity(),
    quantity: randomInt(1, 5),
    unitPrice: randomPrice(1, 1000),
  }));
}

function DetailPanelContent({ row: rowProp }: { row: Customer }) {
  const [isLoading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<
    Awaited<ReturnType<typeof getProducts>>
  >([]);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      console.log('fetching detail panel content for row', rowProp.id);
      const result = await getProducts(rowProp.id);

      if (!isMounted) {
        return;
      }

      setProducts(result);
      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [rowProp.id]);

  return (
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">{`Order #${rowProp.id}`}</Typography>
          <DataGridPro
            density="compact"
            loading={isLoading}
            columns={[
              { field: 'name', headerName: 'Product', flex: 1 },
              {
                field: 'quantity',
                headerName: 'Quantity',
                align: 'center',
                type: 'number',
              },
              { field: 'unitPrice', headerName: 'Unit Price', type: 'number' },
              {
                field: 'total',
                headerName: 'Total',
                type: 'number',
                valueGetter: (value, row) => row.quantity * row.unitPrice,
              },
            ]}
            rows={products}
            sx={{ flex: 1 }}
            hideFooter
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

const columns: GridColDef[] = [
  { field: 'customer', headerName: 'Customer', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
];

function getRow() {
  return {
    id: randomId(),
    customer: randomTraderName(),
    email: randomEmail(),
  };
}

const rows: ReturnType<typeof getRow>[] = [];
for (let i = 0; i < 100; i += 1) {
  rows.push(getRow());
}

type Customer = (typeof rows)[number];

const getDetailPanelContent: DataGridProps['getDetailPanelContent'] = (params) => (
  <DetailPanelContent row={params.row} />
);

const getDetailPanelHeight = () => 240;

export default function LazyLoadingDetailPanel() {
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
      />
    </Box>
  );
}

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {
  randomEmail,
  randomInt,
  randomCommodity,
  randomPrice,
  randomTraderName,
  randomId,
} from '@mui/x-data-grid-generator';
import {
  DataGridPro,
  DataGridProProps,
  GridColDef,
  GridRowId,
  GridRowParams,
} from '@mui/x-data-grid-pro';
import { DetailPanelWrapper, useDetailPanelCache } from './detailPanelCache';

type Products = Awaited<ReturnType<typeof getProducts>>;

const DetailPanelDataCache = React.createContext(new Map<GridRowId, Products>());

async function getProducts(orderId: Customer['id']) {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  const quantity = randomInt(30, 50);
  return [...Array(quantity)].map((_, index) => ({
    id: index,
    orderId,
    name: randomCommodity(),
    quantity: randomInt(1, 5),
    unitPrice: randomPrice(1, 1000),
  }));
}

const detailPanelColumns: GridColDef[] = [
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
];

function DetailPanelContent({
  row: rowProp,
  onLoaded,
}: {
  row: Customer;
  onLoaded?: () => void;
}) {
  const [isLoading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<
    Awaited<ReturnType<typeof getProducts>>
  >([]);

  const detailPanelDataCache = React.useContext(DetailPanelDataCache) as Map<
    GridRowId,
    Products
  >;

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!detailPanelDataCache.has(rowProp.id)) {
        console.log('fetching detail panel content for row', rowProp.id);
        const response = await getProducts(rowProp.id);
        // Store the data in cache so that when detail panel unmounts due to virtualization, the data is not lost
        detailPanelDataCache.set(rowProp.id, response);
      }

      const result = detailPanelDataCache.get(rowProp.id)!;

      if (!isMounted) {
        return;
      }

      setProducts(result);
      setLoading(false);
      onLoaded?.();
    })();

    return () => {
      isMounted = false;
    };
  }, [rowProp.id, detailPanelDataCache, onLoaded]);

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
            columns={detailPanelColumns}
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
for (let i = 0; i < 30; i += 1) {
  rows.push(getRow());
}

type Customer = (typeof rows)[number];

export default function LazyLoadingAutoHeightDetailPanel() {
  const {
    detailPanelDataCache,
    detailPanelHeights,
    handleDetailPanelHeightChange,
    handleDetailPanelExpansionChange,
  } = useDetailPanelCache<Products>();

  const getDetailPanelHeight = React.useCallback(
    (params: { row: Customer }) => {
      const cachedHeight = detailPanelHeights.get(params.row.id);
      return cachedHeight ?? ('auto' as const);
    },
    [detailPanelHeights],
  );

  const getDetailPanelContent: DataGridProProps['getDetailPanelContent'] =
    React.useCallback(
      (params: GridRowParams<Customer>) => (
        <DetailPanelWrapper
          rowId={params.row.id}
          onHeightChange={handleDetailPanelHeightChange}
        >
          <DetailPanelContent row={params.row} />
        </DetailPanelWrapper>
      ),
      [handleDetailPanelHeightChange],
    );

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DetailPanelDataCache.Provider value={detailPanelDataCache}>
        <DataGridPro
          columns={columns}
          rows={rows}
          getDetailPanelHeight={getDetailPanelHeight}
          getDetailPanelContent={getDetailPanelContent}
          onDetailPanelExpandedRowIdsChange={handleDetailPanelExpansionChange}
        />
      </DetailPanelDataCache.Provider>
    </Box>
  );
}

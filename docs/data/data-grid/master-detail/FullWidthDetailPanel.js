import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  useGridApiContext,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomPrice,
  randomCurrency,
  randomCountry,
  randomCity,
  randomEmail,
  randomInt,
  randomAddress,
  randomCommodity,
} from '@mui/x-data-grid-generator';

function DetailPanelContent({ row: rowProp }) {
  const apiRef = useGridApiContext();
  const [width, setWidth] = React.useState(() => {
    const dimensions = apiRef.current.getRootDimensions();
    return dimensions.viewportInnerSize.width;
  });

  const handleViewportInnerSizeChange = React.useCallback(() => {
    const dimensions = apiRef.current.getRootDimensions();
    setWidth(dimensions.viewportInnerSize.width);
  }, [apiRef]);

  React.useEffect(() => {
    return apiRef.current.subscribeEvent(
      'viewportInnerSizeChange',
      handleViewportInnerSizeChange,
    );
  }, [apiRef, handleViewportInnerSizeChange]);

  return (
    <Stack
      sx={{
        py: 2,
        height: '100%',
        boxSizing: 'border-box',
        position: 'sticky',
        left: 0,
        width,
      }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">{`Order #${rowProp.id}`}</Typography>
          <DataGridPro
            density="compact"
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
            rows={rowProp.products}
            sx={{ flex: 1 }}
            hideFooter
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

const columns = [
  { field: 'id', headerName: 'Order ID' },
  { field: 'customer', headerName: 'Customer', width: 200 },
  { field: 'email', headerName: 'Email' },
  { field: 'date', type: 'date', headerName: 'Placed at' },
  { field: 'currency', headerName: 'Currency' },
  { field: 'address', headerName: 'Address' },
  {
    field: 'city',
    headerName: 'City',
    valueGetter: (value, row) => `${row.city}, ${row.country.label}`,
  },
  {
    field: 'total',
    type: 'number',
    headerName: 'Total',
    valueGetter: (value, row) => {
      const subtotal = row.products.reduce(
        (acc, product) => product.unitPrice * product.quantity,
        0,
      );
      const taxes = subtotal * 0.05;
      return subtotal + taxes;
    },
  },
];

function generateProducts() {
  const quantity = randomInt(1, 5);
  return [...Array(quantity)].map((_, index) => ({
    id: index,
    name: randomCommodity(),
    quantity: randomInt(1, 5),
    unitPrice: randomPrice(1, 1000),
  }));
}

const rows = [
  {
    id: 1,
    customer: 'Matheus',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
  {
    id: 2,
    customer: 'Olivier',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
  {
    id: 3,
    customer: 'Flavien',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
  {
    id: 4,
    customer: 'Danail',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
  {
    id: 5,
    customer: 'Alexandre',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
  {
    id: 6,
    customer: 'José',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
];

export default function FullWidthDetailPanel() {
  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} />,
    [],
  );

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        pinnedColumns={{ left: [GRID_DETAIL_PANEL_TOGGLE_FIELD] }}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        sx={{
          '& .MuiDataGrid-detailPanel': {
            overflow: 'visible',
          },
        }}
      />
    </Box>
  );
}

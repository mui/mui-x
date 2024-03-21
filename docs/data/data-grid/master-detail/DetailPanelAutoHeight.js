import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DataGridPro,
  useGridApiContext,
  GridActionsCellItem,
} from '@mui/x-data-grid-pro';
import {
  randomId,
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

function generateProduct() {
  return {
    id: randomId(),
    name: randomCommodity(),
    quantity: randomInt(1, 5),
    unitPrice: randomPrice(1, 1000),
  };
}

function DetailPanelContent({ row: rowProp }) {
  const apiRef = useGridApiContext();

  const addProduct = React.useCallback(() => {
    const newProduct = generateProduct();
    apiRef.current.updateRows([
      { ...rowProp, products: [...rowProp.products, newProduct] },
    ]);
  }, [apiRef, rowProp]);

  const deleteProduct = React.useCallback(
    (productId) => () => {
      const newProducts = rowProp.products.filter(
        (product) => product.id !== productId,
      );
      apiRef.current.updateRows([{ ...rowProp, products: newProducts }]);
    },
    [apiRef, rowProp],
  );

  const columns = React.useMemo(
    () => [
      { field: 'name', headerName: 'Product', flex: 1, editable: true },
      {
        field: 'quantity',
        headerName: 'Quantity',
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        editable: true,
      },
      { field: 'unitPrice', headerName: 'Unit Price', type: 'number' },
      {
        field: 'total',
        headerName: 'Total',
        type: 'number',
        valueGetter: (value, row) => row.quantity * row.unitPrice,
      },
      {
        field: 'actions',
        headerName: '',
        type: 'actions',
        width: 50,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="delete"
            onClick={deleteProduct(row.id)}
          />,
        ],
      },
    ],
    [deleteProduct],
  );

  return (
    <Stack sx={{ py: 2, height: 1, boxSizing: 'border-box' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">{`Order #${rowProp.id}`}</Typography>
          <Grid container>
            <Grid item md={6}>
              <Typography variant="body2" color="textSecondary">
                Customer information
              </Typography>
              <Typography variant="body1">{rowProp.customer}</Typography>
              <Typography variant="body1">{rowProp.email}</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" align="right" color="textSecondary">
                Shipping address
              </Typography>
              <Typography variant="body1" align="right">
                {rowProp.address}
              </Typography>
              <Typography variant="body1" align="right">
                {`${rowProp.city}, ${rowProp.country.label}`}
              </Typography>
            </Grid>
          </Grid>
          <div>
            <Button variant="outlined" size="small" onClick={addProduct}>
              Add Product
            </Button>
          </div>
          <DataGridPro
            density="compact"
            autoHeight
            columns={columns}
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
  { field: 'date', type: 'date', headerName: 'Placed at' },
  { field: 'currency', headerName: 'Currency' },
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
  return [...Array(quantity)].map(generateProduct);
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
];

export default function DetailPanelAutoHeight() {
  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} />,
    [],
  );

  const getDetailPanelHeight = React.useCallback(() => 'auto', []);

  return (
    <Box sx={{ width: 1, height: 400 }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
      />
    </Box>
  );
}

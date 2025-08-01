---
title: Data Grid - Master-detail row panels
---

# Data Grid - Master-detail row panels [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Implement master-detail row panels to let users view extended information without leaving the Data Grid.

## What is the master-detail pattern?

"Master-detail" is a design pattern for organizing information in which the "master" area lists the data and the "detail" sections provide further information about each item.

The Data Grid Pro provides the tools to implement master-detail row panels.
These are useful whenever you need to give end users additional information about row items without navigating away from the Grid.

A common example of this pattern is found in many email clients—users can click on an email from the master list to see its contents (details) as well as actions they can take such as replying, forwarding, and deleting.
To expand a row, click on the **+** icon or press <kbd class="key">Space</kbd> when focused on a cell in the detail toggle column:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import ForwardIcon from '@mui/icons-material/Forward';
import ReplyIcon from '@mui/icons-material/Reply';
import {
  DataGridPro,
  GridColDef,
  useGridApiContext,
  GridRowParams,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  useGridSelector,
  gridDimensionsSelector,
} from '@mui/x-data-grid-pro';
import { randomCreatedDate, randomEmail } from '@mui/x-data-grid-generator';

function DetailPanelContent({ row: rowProp }: { row: Email }) {
  const apiRef = useGridApiContext();
  const width = useGridSelector(apiRef, gridDimensionsSelector).viewportInnerSize
    .width;

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
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 2 }}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h5">{`Subject: ${rowProp.subject}`}</Typography>
          <Typography variant="caption">{`Date: ${rowProp.date.toLocaleString()}`}</Typography>
          <Typography variant="subtitle2">{`From: ${rowProp.name} <${rowProp.email}>`}</Typography>
          <Typography variant="subtitle2">{`To: me <${randomEmail()}>`}</Typography>

          <Typography variant="body2">
            Artisan bitters street art photo booth you probably have not heard of
            them slow-carb food truck. Meh narwhal tumeric bodega boys street art
            Brooklyn venmo. Kinfolk wolf iceland banjo, pitchfork cupping banh mi
            vexillologist cliche locavore venmo. Yuccie kombucha hashtag, bicycle
            rights umami truffaut mumblecore Brooklyn neutral milk hotel aesthetic.
            Wolf plaid leggings butcher solarpunk shabby chic cliche.
          </Typography>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <ButtonGroup variant="text" sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button sx={{ px: 2 }} startIcon={<ReplyIcon />}>
            Reply
          </Button>
          <Button sx={{ px: 2 }} startIcon={<ForwardIcon />}>
            Forward
          </Button>
          <Button sx={{ px: 2 }} color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </ButtonGroup>
      </Paper>
    </Stack>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'From' },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'subject', headerName: 'Subject', width: 300 },
  { field: 'date', type: 'date', headerName: 'Date' },
];

const rows = [
  {
    id: 1,
    name: 'Matheus',
    email: randomEmail(),
    subject: 'Readymade asymmetrical organic salad',
    date: randomCreatedDate(),
  },
  {
    id: 2,
    name: 'Olivier',
    email: randomEmail(),
    subject: 'Chillwave solarpunk grailed waistcoat ramps',
    date: randomCreatedDate(),
  },
  {
    id: 3,
    name: 'Flavien',
    email: randomEmail(),
    subject: 'Williamsburg ugh YOLO',
    date: randomCreatedDate(),
  },
  {
    id: 4,
    name: 'Danail',
    email: randomEmail(),
    subject: 'Humblebrag la croix hexagon big mood',
    date: randomCreatedDate(),
  },
  {
    id: 5,
    name: 'Alexandre',
    email: randomEmail(),
    subject: 'Vinyl chambray kitsch',
    date: randomCreatedDate(),
  },
  {
    id: 6,
    name: 'José',
    email: randomEmail(),
    subject: 'Hella kogi pour-over wolf',
    date: randomCreatedDate(),
  },
];

type Email = (typeof rows)[number];

export default function MasterDetailEmailExample() {
  const getDetailPanelContent = React.useCallback(
    ({ row }: GridRowParams) => <DetailPanelContent row={row} />,
    [],
  );

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        initialState={{
          pinnedColumns: {
            left: [GRID_DETAIL_PANEL_TOGGLE_FIELD],
          },
        }}
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

```

## Implementing master-detail row panels

To create master-detail row panels, pass a function to the `getDetailPanelContent` prop with the content to be rendered inside the panel.
You can use any valid React element—even another Data Grid.

```tsx
<DataGridPro getDetailPanelContent={({ row }) => <div>Row ID: {row.id}</div>} />
```

### Detail panel height

By default, the detail panel height is 500px.
You can customize this by passing a function to the `getDetailPanelHeight` prop.
This function must return either a number or `"auto"`:

- If it returns a number, then the panel will use that value (in pixels) for the height.
- If it returns `"auto"`, then the height will be derived from the content.

```tsx

// fixed height:
<DataGridPro
  getDetailPanelContent={({ row }) => <div>Row ID: {row.id}</div>}
  getDetailPanelHeight={({ row }) => 100}
/>

// height derived from content:
<DataGridPro
  getDetailPanelContent={({ row }) => <div>Row ID: {row.id}</div>}
  getDetailPanelHeight={({ row }) => 'auto'}
/>
```

:::info
The `getDetailPanelContent` and `getDetailPanelHeight` props are called with a [`GridRowParams`](/x/api/data-grid/grid-row-params/) object, which lets you return a different value for each row.
:::

The demo below shows master-detail panels with heights derived from their contents:

```tsx
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
  GridColDef,
  DataGridProProps,
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

function DetailPanelContent({ row: rowProp }: { row: Customer }) {
  const apiRef = useGridApiContext();

  const addProduct = React.useCallback(() => {
    const newProduct = generateProduct();
    apiRef.current.updateRows([
      { ...rowProp, products: [...rowProp.products, newProduct] },
    ]);
  }, [apiRef, rowProp]);

  const deleteProduct = React.useCallback(
    (productId: string) => () => {
      const newProducts = rowProp.products.filter(
        (product) => product.id !== productId,
      );
      apiRef.current.updateRows([{ ...rowProp, products: newProducts }]);
    },
    [apiRef, rowProp],
  );

  const columns = React.useMemo<GridColDef<Customer['products'][number]>[]>(
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
            <Grid size={{ md: 6 }}>
              <Typography variant="body2" color="textSecondary">
                Customer information
              </Typography>
              <Typography variant="body1">{rowProp.customer}</Typography>
              <Typography variant="body1">{rowProp.email}</Typography>
            </Grid>
            <Grid size={{ md: 6 }}>
              <Typography variant="body2" align="right" color="textSecondary">
                Shipping address
              </Typography>
              <Typography variant="body1" align="right">
                {rowProp.address}
              </Typography>
              <Typography
                variant="body1"
                align="right"
              >{`${rowProp.city}, ${rowProp.country.label}`}</Typography>
            </Grid>
          </Grid>
          <div>
            <Button variant="outlined" size="small" onClick={addProduct}>
              Add Product
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <DataGridPro
              density="compact"
              columns={columns}
              rows={rowProp.products}
              hideFooter
            />
          </div>
        </Stack>
      </Paper>
    </Stack>
  );
}

const columns: GridColDef[] = [
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
        (acc: number, product: any) => product.unitPrice * product.quantity,
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

type Customer = (typeof rows)[number];

export default function DetailPanelAutoHeight() {
  const getDetailPanelContent = React.useCallback<
    NonNullable<DataGridProProps['getDetailPanelContent']>
  >(({ row }) => <DetailPanelContent row={row} />, []);

  const getDetailPanelHeight = React.useCallback<
    NonNullable<DataGridProProps['getDetailPanelHeight']>
  >(() => 'auto' as const, []);

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

```

:::warning
Always memoize the function provided to `getDetailPanelContent` and `getDetailPanelHeight`.
The Data Grid depends on the referential value of these props to cache their values and optimize the rendering.

```tsx
const getDetailPanelContent = React.useCallback(() => { ... }, []);

<DataGridPro getDetailPanelContent={getDetailPanelContent} />
```

:::

## Controlling expanded detail panels

To control which rows are expanded, pass a set of row IDs to the `detailPanelExpandedRowIds` prop.
You can pass a callback function to the `onDetailPanelExpandedRowIds` prop to detect when a row is expanded or collapsed.

To initialize the Data Grid with specific row panels expanded, use the `initialState` prop as shown below:

```tsx
<DataGridPro initialState={{ detailPanel: { expandedRowIds: new Set([1, 2, 3]) } }}>
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  GridColDef,
  GridRowsProp,
  GridRowId,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomCurrency,
  randomEmail,
  randomPrice,
} from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';

export default function ControlMasterDetail() {
  const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = React.useState(
    () => new Set<GridRowId>(),
  );

  const handleDetailPanelExpandedRowIdsChange = React.useCallback<
    NonNullable<DataGridProProps['onDetailPanelExpandedRowIdsChange']>
  >((newIds) => {
    setDetailPanelExpandedRowIds(newIds);
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Alert severity="info">
        <code>
          detailPanelExpandedRowIds: {JSON.stringify(detailPanelExpandedRowIds)}
        </code>
      </Alert>
      <Box sx={{ height: 400, mt: 1 }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          getDetailPanelContent={({ row }) => (
            <Box sx={{ p: 2 }}>{`Order #${row.id}`}</Box>
          )}
          getDetailPanelHeight={() => 50}
          detailPanelExpandedRowIds={detailPanelExpandedRowIds}
          onDetailPanelExpandedRowIdsChange={handleDetailPanelExpandedRowIdsChange}
        />
      </Box>
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

```

## Lazy-loading detail panel content

You don't need to provide the content for detail panels upfront—instead, you can load it lazily when a row is expanded.

In the following example, the `<DetailPanelContent />` component fetches data on mount.
This component is used by the `getDetailPanelContent` prop to render the detail panel content.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { DataGridPro, DataGridProProps, GridColDef } from '@mui/x-data-grid-pro';
import {
  randomEmail,
  randomInt,
  randomCommodity,
  randomPrice,
  randomTraderName,
  randomId,
} from '@mui/x-data-grid-generator';
import { DataGridProps, GridRowId } from '@mui/x-data-grid';

type Products = Awaited<ReturnType<typeof getProducts>>;

const DetailPanelDataCache = React.createContext(new Map<GridRowId, Products>());

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

  const detailPanelDataCache = React.useContext(DetailPanelDataCache);

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
    })();

    return () => {
      isMounted = false;
    };
  }, [rowProp.id, detailPanelDataCache]);

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
  const detailPanelDataCache = React.useRef(new Map<GridRowId, Products>()).current;

  const handleDetailPanelExpansionChange = React.useCallback<
    NonNullable<DataGridProProps['onDetailPanelExpandedRowIdsChange']>
  >(
    (newExpandedRowIds) => {
      // Only keep cached data for detail panels that are still expanded
      for (const [id] of detailPanelDataCache) {
        if (!newExpandedRowIds.has(id)) {
          detailPanelDataCache.delete(id);
        }
      }
    },
    [detailPanelDataCache],
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

```

## Using a detail panel as a form

As an alternative to the built-in [row editing feature](/x/react-data-grid/editing/#row-editing), you can render a form component inside the detail panel so users can edit the row values.

The demo below shows how to implement this behavior using [react-hook-form](https://react-hook-form.com/), but other form libraries are also supported.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import {
  DataGridPro,
  GridColDef,
  GridRowModelUpdate,
  useGridApiContext,
  GridRowParams,
} from '@mui/x-data-grid-pro';
import { randomEmail } from '@mui/x-data-grid-generator';

function DetailPanelContent({ row }: { row: Customer }) {
  const apiRef = useGridApiContext();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: row,
    mode: 'onChange',
  });

  const onSubmit = (data: GridRowModelUpdate) => {
    apiRef.current.updateRows([data]);
    apiRef.current.toggleDetailPanel(row.id);
  };

  return (
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack
          component="form"
          justifyContent="space-between"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ height: 1 }}
        >
          <Typography variant="h6">{`Edit Order #${row.id}`}</Typography>
          <Controller
            control={control}
            name="customer"
            rules={{ required: true }}
            render={({ field, fieldState: { invalid } }) => (
              <TextField
                label="Customer"
                size="small"
                error={invalid}
                required
                fullWidth
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            render={({ field, fieldState: { invalid } }) => (
              <TextField
                label="Email"
                size="small"
                error={invalid}
                required
                fullWidth
                {...field}
              />
            )}
          />
          <div>
            <Button
              type="submit"
              variant="outlined"
              size="small"
              disabled={!isValid}
            >
              Save
            </Button>
          </div>
        </Stack>
      </Paper>
    </Stack>
  );
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID' },
  { field: 'customer', headerName: 'Customer', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
];

const rows = [
  {
    id: 1,
    customer: 'Matheus',
    email: randomEmail(),
  },
  {
    id: 2,
    customer: 'Olivier',
    email: randomEmail(),
  },
  {
    id: 3,
    customer: 'Flavien',
    email: randomEmail(),
  },
  {
    id: 4,
    customer: 'Danail',
    email: randomEmail(),
  },
  {
    id: 5,
    customer: 'Alexandre',
    email: randomEmail(),
  },
];

type Customer = (typeof rows)[number];

export default function FormDetailPanel() {
  const getDetailPanelContent = React.useCallback(
    ({ row }: GridRowParams) => <DetailPanelContent row={row} />,
    [],
  );

  const getDetailPanelHeight = React.useCallback(() => 240, []);

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

```

## Customizing the detail panel toggle

To change the icon used for the toggle, you can provide a different component for the [icon slot](/x/react-data-grid/components/#icons) as shown here:

```tsx
<DataGridPro
  slots={{
    detailPanelExpandIcon: CustomExpandIcon,
    detailPanelCollapseIcon: CustomCollapseIcon,
  }}
/>
```

You can also completely override the toggle component by adding another column to your set with `field: GRID_DETAIL_PANEL_TOGGLE_FIELD`.
This prevents the Data Grid from adding the default toggle column.
Then you can add a new toggle component using [`renderCell()`](/x/react-data-grid/column-definition/#rendering-cells) as you would for any other column:

```tsx
<DataGridPro
  columns={[
    {
      field: GRID_DETAIL_PANEL_TOGGLE_FIELD,
      renderCell: (params) => <CustomDetailPanelToggle {...params} />,
    },
  ]}
/>
```

Because the `field` is the only property defined, it's up to you to configure any additional options (such as filtering, sorting, or disabling the column menu).
If you'd rather set up the toggle with basic options preconfigured, you can spread `GRID_DETAIL_PANEL_TOGGLE_COL_DEF` when defining the column, as shown below:

```tsx
<DataGridPro
  columns={[
    {
      ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF, // Already contains the right field
      renderCell: (params) => <CustomDetailPanelToggle {...params}>
    },
  ]}
/>
```

You can also use this approach to change the location of the toggle column, as shown in the demo below:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  DataGridPro,
  GridColDef,
  GridRowsProp,
  GridRenderCellParams,
  GridRowParams,
  useGridSelector,
  useGridApiContext,
  gridDetailPanelExpandedRowsContentCacheSelector,
  gridDetailPanelExpandedRowIdsSelector,
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
    ({ row }: GridRowParams) =>
      row.id % 2 === 0 ? <Box sx={{ p: 2 }}>{`Order #${row.id}`}</Box> : null,
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

function CustomDetailPanelToggle(props: Pick<GridRenderCellParams, 'id' | 'value'>) {
  const { id } = props;
  const apiRef = useGridApiContext();

  // To avoid calling ´getDetailPanelContent` all the time, the following selector
  // gives an object with the detail panel content for each row id.
  const contentCache = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsContentCacheSelector,
  );

  const expandedRowIds = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowIdsSelector,
  );

  const isExpanded = expandedRowIds.has(id);

  // If the value is not a valid React element, it means that the row has no detail panel.
  const hasDetail = React.isValidElement(contentCache[id]);

  return (
    <IconButton
      size="small"
      tabIndex={-1}
      disabled={!hasDetail}
      aria-label={isExpanded ? 'Close' : 'Open'}
    >
      <ExpandMoreIcon
        sx={(theme) => ({
          transform: `rotateZ(${isExpanded ? 180 : 0}deg)`,
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
        })}
        fontSize="inherit"
      />
    </IconButton>
  );
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID' },
  { field: 'customer', headerName: 'Customer', width: 200 },
  { field: 'date', type: 'date', headerName: 'Placed at' },
  { field: 'currency', headerName: 'Currency' },
  { field: 'total', type: 'number', headerName: 'Total' },
  {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    renderCell: (params) => (
      <CustomDetailPanelToggle id={params.id} value={params.value} />
    ),
  },
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

```

:::info
As with any other cell renderer, the `value` prop is also available, and it corresponds to the state of the row: it's set to `true` when expanded and `false` when collapsed.
:::

## Customizing the detail panel column header

To render a custom header for the detail panel column, use the [`renderHeader`](/x/react-data-grid/column-header/#custom-header-renderer) property in the column definition.
This property receives a `GridRenderHeaderParams` object that contains `colDef` (the column definition) and `field`.
The snippet below shows how to do this:

```tsx
const columns = [
  {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    renderHeader: (params) => (
      <div>
        <span>{params.colDef.headerName}</span>
        <button onClick={() => console.log('Custom action')}>Custom action</button>
      </div>
    ),
  },
  //... other columns
];
```

:::success
For a more complex example of this use case, see the recipe for [expanding or collapsing all detail panels](/x/react-data-grid/row-recipes/#expand-or-collapse-all-detail-panels).
:::

## Disabling detail panel content scroll

By default, the detail panel's width is equal to the sum of the widths of all columns.
This means that when a horizontal scrollbar is present, scrolling it also scrolls the panel content.
To avoid this behavior, set the size of the detail panel to the outer size of the Data Grid.
Use `apiRef.current.getRootDimensions()` to get the latest dimension values.
And to prevent the panel from scrolling, set `position: sticky` and `left: 0`.

The following demo shows how to accomplish this—notice that the toggle column is pinned so it remains visible when the user scrolls horizontally:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  GridColDef,
  useGridApiContext,
  GridRowParams,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  useGridSelector,
  gridDimensionsSelector,
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

function DetailPanelContent({ row: rowProp }: { row: Customer }) {
  const apiRef = useGridApiContext();
  const width = useGridSelector(apiRef, gridDimensionsSelector).viewportInnerSize
    .width;

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

const columns: GridColDef[] = [
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
        (acc: number, product: any) => product.unitPrice * product.quantity,
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

type Customer = (typeof rows)[number];

export default function FullWidthDetailPanel() {
  const getDetailPanelContent = React.useCallback(
    ({ row }: GridRowParams) => <DetailPanelContent row={row} />,
    [],
  );

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        initialState={{
          pinnedColumns: {
            left: [GRID_DETAIL_PANEL_TOGGLE_FIELD],
          },
        }}
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

```

## Master-detail row panel recipes

For more examples of how to customize master-detail row panels, check out the following recipes:

- [One expanded detail panel at a time](/x/react-data-grid/row-recipes/#one-expanded-detail-panel-at-a-time)
- [Expand or collapse all detail panels](/x/react-data-grid/row-recipes/#expand-or-collapse-all-detail-panels)
- [Toggling detail panels on row click](/x/react-data-grid/row-recipes/#toggling-detail-panels-on-row-click)

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of master-detail row panels.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-detail-panel-api.json';

export default function DetailPanelApiNoSnap() {
  return <ApiDocs proApi={api} />;
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)

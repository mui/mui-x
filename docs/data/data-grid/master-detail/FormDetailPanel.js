import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import { DataGridPro, useGridApiContext } from '@mui/x-data-grid-pro';
import { randomEmail } from '@mui/x-data-grid-generator';

function DetailPanelContent({ row }) {
  const apiRef = useGridApiContext();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: row,
    mode: 'onChange',
  });

  const onSubmit = (data) => {
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

const columns = [
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

export default function FormDetailPanel() {
  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} />,
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

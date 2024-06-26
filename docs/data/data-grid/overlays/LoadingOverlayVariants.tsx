import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid, GridLoadingOverlayVariant } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function VariantControl(props: SelectProps) {
  const { value, onChange, label, id } = props;
  const labelId = `${id}-label`;
  return (
    <FormControl>
      <InputLabel htmlFor={id} id={labelId}>
        {label}
      </InputLabel>
      <Select
        label={label}
        id={id}
        labelId={labelId}
        value={value}
        onChange={onChange}
        size="small"
        sx={{ width: 180 }}
      >
        <MenuItem value="circular-progress">Circular Progress</MenuItem>
        <MenuItem value="linear-progress">Linear Progress</MenuItem>
        <MenuItem value="skeleton">Skeleton</MenuItem>
      </Select>
    </FormControl>
  );
}

function RowsControl(props: SwitchProps) {
  const { checked, onChange } = props;
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} />}
      label="Rows"
    />
  );
}

export default function LoadingOverlayVariants() {
  const [withRows, setWithRows] = React.useState(true);
  const [variant, setVariant] =
    React.useState<GridLoadingOverlayVariant>('linear-progress');
  const [noRowsVariant, setNoRowsVariant] =
    React.useState<GridLoadingOverlayVariant>('skeleton');

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 5,
    maxColumns: 9,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ my: 1 }}>
        <VariantControl
          label="Variant"
          id="variant"
          value={variant}
          onChange={(event) =>
            setVariant(event.target.value as GridLoadingOverlayVariant)
          }
        />
        <VariantControl
          label="No rows variant"
          id="noRowsVariant"
          value={noRowsVariant}
          onChange={(event) =>
            setNoRowsVariant(event.target.value as GridLoadingOverlayVariant)
          }
        />
        <RowsControl
          checked={withRows}
          onChange={(event) => setWithRows(event.target.checked)}
        />
      </Stack>
      <Box sx={{ height: 345 }}>
        <DataGrid
          {...data}
          loading
          slotProps={{
            loadingOverlay: {
              noRowsVariant,
              variant,
            },
          }}
          rows={withRows ? data.rows : []}
        />
      </Box>
    </Box>
  );
}

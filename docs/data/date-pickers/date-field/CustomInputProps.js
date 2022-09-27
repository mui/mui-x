import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Close';

export default function CustomInputProps() {
  const [value, setValue] = React.useState(dayjs('2022-04-07'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={(theme) => ({ width: theme.spacing(48) })}>
        <DateField
          label="Custom variant"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          variant="filled"
        />
        <DateField
          label="Disabled"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          disabled
        />
        <DateField
          label="Read only"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          readOnly
        />
        <DateField
          label="Clearable"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          InputProps={{
            endAdornment: (
              <IconButton size="small" onClick={() => setValue(null)}>
                <CancelIcon />
              </IconButton>
            ),
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
}

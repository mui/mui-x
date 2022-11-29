import * as React from 'react';
import { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';

export default function FormPropsDatePickers() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  const defaultProps = {
    value,
    onChange: (newValue: typeof value) => {
      setValue(newValue);
    },
    renderInput: (params: any) => <TextField {...params} />,
  };

  return (
    <Stack spacing={3}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker {...defaultProps} label="disabled" disabled />
        <DatePicker {...defaultProps} label="readOnly" readOnly />
      </LocalizationProvider>
    </Stack>
  );
}

import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_MultiInputTimeRangeField as MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
// import { Unstable_SingleInputTimeRangeField as SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';

export default function BasicTimeRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
        <MultiInputTimeRangeField />
        {/*<SingleInputTimeRangeField />*/}
      </Stack>
    </LocalizationProvider>
  );
}

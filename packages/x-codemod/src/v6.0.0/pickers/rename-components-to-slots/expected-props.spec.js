import { NextDatePicker } from '@mui/x-date-pickers';
import { NextDateRangePicker } from '@mui/x-date-pickers-pro';
import TextField from '@mui/material/TextField';

<div>
  <NextDateRangePicker
    slotProps={{
      layout: {
        sx: {
          width: 50,
        },
      },
    }}
    slots={{
      layout: test,
    }}
  />
  <NextDatePicker
    slots={{
      layout: CustomLayout,
    }}
  />
  <TextField
    components={{
      Input: CustomInput,
    }}
  />
</div>;

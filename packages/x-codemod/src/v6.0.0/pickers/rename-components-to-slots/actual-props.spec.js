import { NextDatePicker } from '@mui/x-date-pickers';
import { NextDateRangePicker } from '@mui/x-date-pickers-pro';
import TextField from '@mui/material/TextField';

<div>
  <NextDateRangePicker
    componentsProps={{
      layout: {
        sx: {
          width: 50,
        },
      },
    }}
    components={{
      Layout: test,
    }}
  />
  <NextDatePicker
    components={{
      Layout: CustomLayout,
    }}
  />
  <TextField
    components={{
      Input: CustomInput,
    }}
  />
</div>;

import { DatePicker } from '@mui/x-date-pickers';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import TextField from '@mui/material/TextField';

<div>
  <DateRangePicker
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
  <DatePicker
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

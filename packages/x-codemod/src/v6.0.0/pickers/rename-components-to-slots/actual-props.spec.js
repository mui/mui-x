import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
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

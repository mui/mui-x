import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import TextField from '@mui/material/TextField';

<div>
  <DateRangePicker
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
  <DatePicker
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

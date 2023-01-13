import { NextDatePicker } from '@mui/x-date-pickers';
import { NextDateRangePicker } from '@mui/x-date-pickers-pro';

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
</div>;

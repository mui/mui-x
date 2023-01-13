import { NextDatePicker } from '@mui/x-date-pickers';
import { NextDateRangePicker } from '@mui/x-date-pickers-pro';

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
</div>;

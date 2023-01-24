import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

export default function DateRangePickerValue() {
  const [value, setValue] = React.useState([
    dayjs('2022-04-07'),
    dayjs('2022-04-10'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['NextDateRangePicker', 'NextDateRangePicker']}>
        <DemoItem label="Uncontrolled picker" components={['NextDateRangePicker']}>
          <NextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Controlled picker" components={['NextDateRangePicker']}>
          <NextDateRangePicker
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

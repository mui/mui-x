import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function TimeRangePickerValue() {
  const [value, setValue] = React.useState([
    dayjs('2022-04-17T15:30'),
    dayjs('2022-04-17T18:30'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeRangePicker', 'TimeRangePicker']}>
        <DemoItem label="Uncontrolled picker" component="TimeRangePicker">
          <TimeRangePicker
            defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
          />
        </DemoItem>
        <DemoItem label="Controlled picker" component="TimeRangePicker">
          <TimeRangePicker
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

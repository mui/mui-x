import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import {
  renderDigitalClockTimeView,
  renderTimeViewClock,
} from '@mui/x-date-pickers/timeViewRenderers';

export default function DateTimeRangePickerViewRenderer() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimeRangePicker', 'DateTimeRangePicker']}>
        <DemoItem label="With digital clock" component="DateTimeRangePicker">
          <DateTimeRangePicker
            views={['day', 'hours']}
            timeSteps={{ minutes: 20 }}
            viewRenderers={{ hours: renderDigitalClockTimeView }}
          />
        </DemoItem>
        <DemoItem label="With analog clock" component="DateTimeRangePicker">
          <DateTimeRangePicker
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

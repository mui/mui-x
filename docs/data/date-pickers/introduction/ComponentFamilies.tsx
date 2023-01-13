import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { Unstable_TimeField as TimeField } from '@mui/x-date-pickers/TimeField';
import { Unstable_DateTimeField as DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { Unstable_MultiInputTimeRangeField as MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { Unstable_MultiInputDateTimeRangeField as MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';

export default function ComponentFamilies() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="Date">
          <DateField defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label="Time">
          <TimeField defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Date Time">
          <DateTimeField defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem
          label={
            <React.Fragment>
              Date Range <span className="plan-pro" />
            </React.Fragment>
          }
        >
          <MultiInputDateRangeField
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem
          label={
            <React.Fragment>
              Time Range <span className="plan-pro" />
            </React.Fragment>
          }
        >
          <MultiInputTimeRangeField
            defaultValue={[dayjs('2022-04-07T15:30'), dayjs('2022-04-07T18:30')]}
          />
        </DemoItem>
        <DemoItem
          label={
            <React.Fragment>
              Date Time Range <span className="plan-pro" />
            </React.Fragment>
          }
        >
          <MultiInputDateTimeRangeField
            defaultValue={[dayjs('2022-04-07T15:30'), dayjs('2022-04-10T18:30')]}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

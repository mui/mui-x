import * as React from 'react';
import { DemoContainer, DemoItem } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

export default function CommonlyUsedComponents() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem
          label={
            <React.Fragment>
              <code>DatePicker</code> for date editing
            </React.Fragment>
          }
        >
          <NextDatePicker />
        </DemoItem>
        <DemoItem
          label={
            <React.Fragment>
              <code>TimePicker</code> for time editing
            </React.Fragment>
          }
        >
          <NextTimePicker />
        </DemoItem>
        <DemoItem
          label={
            <React.Fragment>
              <code>DateTimePicker</code> for date time editing
            </React.Fragment>
          }
        >
          <NextDateTimePicker />
        </DemoItem>
        <DemoItem
          label={
            <React.Fragment>
              <code>DateRangePicker</code> for date range editing{' '}
              <span className="plan-pro" />
            </React.Fragment>
          }
        >
          <NextDateRangePicker />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

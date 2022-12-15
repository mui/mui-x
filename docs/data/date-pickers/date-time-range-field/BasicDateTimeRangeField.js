import * as React from 'react';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_MultiInputDateTimeRangeField as MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { Unstable_SingleInputDateTimeRangeField as SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';

export default function BasicDateTimeRangeField() {
  const [value, setValue] = React.useState([null, null]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <MultiInputDateTimeRangeField
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
        <SingleInputDateTimeRangeField
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

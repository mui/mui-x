import * as React from 'react';
import { PickersGrid } from 'docsx/src/modules/components/PickersGrid';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function BasicDateRangeField() {
  const [value, setValue] = React.useState<any>([null, null]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PickersGrid>
        <MultiInputDateRangeField
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
        <SingleInputDateRangeField
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </PickersGrid>
    </LocalizationProvider>
  );
}

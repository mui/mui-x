import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';

export default function DateTimeRangeFieldValue() {
  const [value, setValue] = React.useState(() => [
    dayjs('2022-04-07T15:30'),
    dayjs('2022-04-13T18:30'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'SingleInputDateTimeRangeField',
          'SingleInputDateTimeRangeField',
        ]}
      >
        <SingleInputDateTimeRangeField
          label="Uncontrolled field"
          defaultValue={[dayjs('2022-04-07T15:30'), dayjs('2022-04-13T18:30')]}
        />
        <SingleInputDateTimeRangeField
          label="Controlled field"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

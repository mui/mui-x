import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
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
        <DemoItem label="Uncontrolled field">
          <SingleInputDateTimeRangeField
            defaultValue={[dayjs('2022-04-07T15:30'), dayjs('2022-04-13T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Controlled field">
          <SingleInputDateTimeRangeField
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

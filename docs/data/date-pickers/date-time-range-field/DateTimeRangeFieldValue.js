import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import { DemoContainer } from '../_shared/DemoContainer';

export default function DateTimeRangeFieldValue() {
  const [value, setValue] = React.useState(() => [
    dayjs('2022-04-17T15:30'),
    dayjs('2022-04-21T18:30'),
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
          defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
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

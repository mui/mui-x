import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';

export default function TimeRangeFieldValue() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>(() => [
    dayjs('2022-04-17T15:30'),
    dayjs('2022-04-17T18:30'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['SingleInputTimeRangeField', 'SingleInputTimeRangeField']}
      >
        <SingleInputTimeRangeField
          label="Uncontrolled field"
          defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
        />
        <SingleInputTimeRangeField
          label="Controlled field"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { PickersGrid } from 'docsx/src/modules/components/PickersGrid';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function DateRangeFieldValue() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>(() => [
    dayjs('2022-04-07'),
    dayjs('2022-04-13'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PickersGrid>
        <SingleInputDateRangeField
          label="Uncontrolled field"
          defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-13')]}
        />
        <SingleInputDateRangeField
          label="Controlled field"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </PickersGrid>
    </LocalizationProvider>
  );
}

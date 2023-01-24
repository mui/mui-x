import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateRange } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';

export default function DateTimeRangeFieldValue() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>(() => [
    dayjs('2022-04-07T15:30'),
    dayjs('2022-04-13T18:30'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={["SingleInputDateTimeRangeField", "SingleInputDateTimeRangeField"]}>
        <DemoItem label="Uncontrolled field" components={["SingleInputDateTimeRangeField"]}>
          <SingleInputDateTimeRangeField
            defaultValue={[dayjs('2022-04-07T15:30'), dayjs('2022-04-13T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Controlled field" components={["SingleInputDateTimeRangeField"]}>
          <SingleInputDateTimeRangeField
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

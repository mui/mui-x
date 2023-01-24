import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateRange } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';

export default function TimeRangeFieldValue() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>(() => [
    dayjs('2022-04-07T15:30'),
    dayjs('2022-04-07T18:30'),
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["SingleInputTimeRangeField", "SingleInputTimeRangeField"]}>
        <DemoItem label="Uncontrolled field" components={["SingleInputTimeRangeField"]}>
          <SingleInputTimeRangeField
            defaultValue={[dayjs('2022-04-07T15:30'), dayjs('2022-04-07T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Controlled field" components={["SingleInputTimeRangeField"]}>
          <SingleInputTimeRangeField
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

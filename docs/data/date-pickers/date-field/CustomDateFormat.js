import * as React from 'react';
import { PickersGrid } from 'docsx/src/modules/components/PickersGrid';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';

export default function CustomDateFormat() {
  const [value, setValue] = React.useState(dayjs('2022-04-07'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PickersGrid>
        <DateField
          label="Dash separator"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="MM-DD-YYYY"
        />
        <DateField
          label="Full letter month"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="LL"
        />
      </PickersGrid>
    </LocalizationProvider>
  );
}

import * as React from 'react';
import { Dayjs } from 'dayjs';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function ControlledComponent() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextDatePicker
          label="Controlled Date Picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

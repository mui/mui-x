import * as React from 'react';
import { Dayjs } from 'dayjs';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckIcon from '@mui/icons-material/Check';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SimpleValue } from '@mui/x-date-pickers/models';

export default function CustomOpeningIconConditional() {
  const [value, setValue] = React.useState<SimpleValue>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          value={value}
          onChange={setValue}
          slots={{
            openPickerIcon:
              value == null || !(value as Dayjs).isValid()
                ? PriorityHighIcon
                : CheckIcon,
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

import * as React from 'react';
import { Dayjs } from 'dayjs';
import { createSvgIcon } from '@mui/material/utils';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const PriorityHighIcon = createSvgIcon(
  <React.Fragment>
    <circle cx="12" cy="19" r="2" />
    <path d="M10 3h4v12h-4z" />
  </React.Fragment>,
  'PriorityHigh',
);

const CheckIcon = createSvgIcon(
  <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />,
  'Check',
);

export default function CustomOpeningIconConditional() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          value={value}
          onChange={setValue}
          slots={{
            openPickerIcon:
              value == null || !value.isValid() ? PriorityHighIcon : CheckIcon,
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

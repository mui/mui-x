import * as React from 'react';
import dayjs from 'dayjs';
import InputAdornment, { InputAdornmentProps } from '@mui/material/InputAdornment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateValidationError } from '@mui/x-date-pickers/models';

function CustomInputAdornment(props: InputAdornmentProps & { hasError?: boolean }) {
  const { hasError, children, sx, ...other } = props;
  return (
    <InputAdornment {...other}>
      <PriorityHighIcon
        color="error"
        sx={[
          {
            marginLeft: 1,
          },
          hasError
            ? {
                opacity: 1,
              }
            : {
                opacity: 0,
              },
        ]}
      />
      {children}
    </InputAdornment>
  );
}

export default function AddWarningIconWhenInvalid() {
  const [error, setError] = React.useState<DateValidationError>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label="Picker with error icon"
          maxDate={dayjs('2022-04-17')}
          defaultValue={dayjs('2022-04-18')}
          onError={setError}
          slots={{ inputAdornment: CustomInputAdornment }}
          slotProps={{
            inputAdornment: { hasError: !!error } as any,
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

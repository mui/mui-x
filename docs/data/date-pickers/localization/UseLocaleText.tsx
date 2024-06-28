import * as React from 'react';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { useLocaleText } from '@mui/x-date-pickers/hooks';

function CustomActionBar(props: PickersActionBarProps) {
  const { onAccept, className } = props;
  const localeText = useLocaleText();

  return (
    <DialogActions className={className}>
      <Button onClick={onAccept}>{localeText.okButtonLabel}</Button>
    </DialogActions>
  );
}

export default function UseLocaleText() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        defaultValue={dayjs('2022-04-17')}
        slots={{
          actionBar: CustomActionBar,
        }}
        slotProps={{
          actionBar: {
            actions: ['accept'],
          },
        }}
      />
    </LocalizationProvider>
  );
}

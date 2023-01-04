import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import AlarmIcon from '@mui/icons-material/Alarm';
import SnoozeIcon from '@mui/icons-material/Snooze';
import ClockIcon from '@mui/icons-material/AccessTime';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

export default function CustomDateTimePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextDateTimePicker
          openTo="hours"
          defaultValue={dayjs('2022-04-07T15:30')}
          components={{
            LeftArrowIcon: AlarmIcon,
            RightArrowIcon: SnoozeIcon,
            OpenPickerIcon: ClockIcon,
          }}
          componentsProps={{
            textField: {
              helperText: 'Hardcoded helper text',
            },
          }}
        />
        <NextDateTimePicker label="With error handler" onError={console.log} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

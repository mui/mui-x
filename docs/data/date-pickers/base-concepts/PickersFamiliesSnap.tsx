import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';

import Stack from '@mui/material/Stack';

// Only create for snapshot purpose
export default function PickersFamiliesSnap() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="column" spacing={1}>
        <DesktopDatePicker
          label="DesktopDatePicker"
          defaultValue={dayjs('2022-04-17T10:36:55')}
        />
        <DesktopTimePicker
          label="DesktopTimePicker"
          defaultValue={dayjs('2022-04-17T10:36:55')}
        />
        <DesktopDateTimePicker
          label="DesktopDateTimePicker"
          defaultValue={dayjs('2022-04-17T10:36:55')}
        />
        <MobileDatePicker
          label="MobileDatePicker"
          defaultValue={dayjs('2022-04-17T10:36:55')}
        />
        <MobileTimePicker
          label="MobileTimePicker"
          defaultValue={dayjs('2022-04-17T10:36:55')}
        />
        <MobileDateTimePicker
          label="MobileDateTimePicker"
          defaultValue={dayjs('2022-04-17T10:36:55')}
        />
        <DesktopDateRangePicker
          label="DesktopDateRangePicker"
          defaultValue={[dayjs('2022-04-17T10:36:55'), dayjs('2022-04-19T10:36:55')]}
        />
        <MobileDateRangePicker
          label="MobileDateRangePicker"
          defaultValue={[dayjs('2022-04-17T10:36:55'), dayjs('2022-04-19T10:36:55')]}
        />
      </Stack>
    </LocalizationProvider>
  );
}

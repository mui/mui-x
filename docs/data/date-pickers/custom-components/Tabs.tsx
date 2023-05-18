import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import {
  DateTimePickerTabs,
  DateTimePickerTabsProps,
} from '@mui/x-date-pickers/DateTimePicker';
import LightModeIcon from '@mui/icons-material/LightMode';
import AcUnitIcon from '@mui/icons-material/AcUnit';

function CustomTabs(props: DateTimePickerTabsProps) {
  return (
    <React.Fragment>
      <DateTimePickerTabs {...props} />
      <Box sx={{ backgroundColor: 'blueviolet', height: 5 }} />
    </React.Fragment>
  );
}

export default function Tabs() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateTimePicker
        defaultValue={dayjs('2022-04-17')}
        slots={{ tabs: CustomTabs }}
        slotProps={{
          tabs: {
            hidden: false,
            dateIcon: <LightModeIcon />,
            timeIcon: <AcUnitIcon />,
          },
        }}
      />
    </LocalizationProvider>
  );
}

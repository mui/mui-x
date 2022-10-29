import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {
  DateTimePicker,
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
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Tabs"
        renderInput={(params) => <TextField {...params} />}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        hideTabs={false}
        components={{ Tabs: CustomTabs }}
        componentsProps={{
          tabs: {
            dateRangeIcon: <LightModeIcon />,
            timeIcon: <AcUnitIcon />,
          },
        }}
      />
    </LocalizationProvider>
  );
}

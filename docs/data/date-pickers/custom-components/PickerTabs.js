import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField, Box } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimePickerTabs } from '@mui/x-date-pickers/DateTimePicker/DateTimePickerTabs';
import LightModeIcon from '@mui/icons-material/LightMode';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const CustomPickerTabs = (props) => (
  <React.Fragment>
    <DateTimePickerTabs {...props} />
    <Box sx={{ backgroundColor: 'blueviolet', height: 5 }} />
  </React.Fragment>
);

export default function PickerTabs() {
  const [value, setValue] = React.useState(dayjs());
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Picker tabs"
        renderInput={(params) => <TextField {...params} />}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        hideTabs={false}
        components={{ PickerTabs: CustomPickerTabs }}
        componentsProps={{
          pickerTabs: {
            dateRangeIcon: <LightModeIcon />,
            timeIcon: <AcUnitIcon />,
          },
        }}
      />
    </LocalizationProvider>
  );
}

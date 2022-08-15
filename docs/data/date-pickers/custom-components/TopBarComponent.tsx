import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

const CustomTopBar = () => (
  <Box sx={{ mx: 3, my: 2 }}>
    <Typography variant="overline">Select date using controls below</Typography>
    <Divider />
  </Box>
);

export default function TopBarComponent() {
  const [value, setValue] = React.useState<Date | null>(
    () => new Date(2022, 1, 1, 1, 1),
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        onChange={(newValue) => setValue(newValue)}
        value={value}
        renderInput={(params) => <TextField {...params} />}
        components={{
          TopBar: CustomTopBar,
        }}
      />
    </LocalizationProvider>
  );
}

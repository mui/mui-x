import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickerDay2, pickerDay2Classes } from '@mui/x-date-pickers/PickerDay2';

export default function PickerDay2DemoCSSVars() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <StaticDatePicker
          sx={{
            [`& .${pickerDay2Classes.root}`]: {
              '--PickerDay-horizontalMargin': '8px',
              '--PickerDay-size': '24px',
            },
          }}
          slotProps={{
            actionBar: {
              actions: ['accept', 'cancel'],
            },
          }}
          slots={{ day: PickerDay2 }}
        />
      </Box>
    </LocalizationProvider>
  );
}

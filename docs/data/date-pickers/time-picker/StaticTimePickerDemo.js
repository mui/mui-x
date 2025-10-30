import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';

export default function StaticTimePickerDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticTimePicker />
    </LocalizationProvider>
  );
}

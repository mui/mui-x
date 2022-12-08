import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function DatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextDatePicker label="Date Picker" sx={{ width: 200 }} />
    </LocalizationProvider>
  );
}

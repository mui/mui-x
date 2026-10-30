import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function BasicTimeClock() {
  return (
    // @focus-start @padding 2
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimeClock />
    </LocalizationProvider>
    // @focus-end
  );
}

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

export default function ReferenceDateRange() {
  return (
    // @focus-start @padding 2
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimeRangePicker
        referenceDate={[dayjs('2022-04-17T07:45'), dayjs('2022-04-21T17:30')]}
      />
    </LocalizationProvider>
    // @focus-end
  );
}

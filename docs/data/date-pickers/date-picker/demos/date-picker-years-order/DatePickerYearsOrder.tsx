import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const currentYear = dayjs();

export default function DatePickerYearsOrder() {
  return (
    // @focus-start @padding 2
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Years in descending order"
        maxDate={currentYear}
        openTo="year"
        views={['year', 'month']}
        yearsOrder="desc"
        sx={{ minWidth: 250 }}
      />
    </LocalizationProvider>
    // @focus-end
  );
}

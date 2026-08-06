import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function CalendarDaySizeDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar', 'DateCalendar']}>
        <DateCalendar sx={{ '--PickerCalendar-daySize': '24px' }} />
        <DateCalendar sx={{ '--PickerCalendar-daySize': '48px' }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

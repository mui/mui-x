import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

export default function DateTimePickerOpenTo() {
  return (
    // @focus-start @padding 2
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'MobileTimePicker']}>
        <DateTimePicker label={'"year"'} openTo="year" />
        <MobileTimePicker label={'"hours"'} openTo="hours" />
      </DemoContainer>
    </LocalizationProvider>
    // @focus-end
  );
}

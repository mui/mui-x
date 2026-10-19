import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CustomSlotProps() {
  return (
    // @focus-start @padding 2
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        slotProps={{
          openPickerIcon: {
            color: 'primary',
          },
        }}
      />
    </LocalizationProvider>
    // @focus-end
  );
}

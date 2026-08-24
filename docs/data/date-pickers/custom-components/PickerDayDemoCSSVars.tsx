import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function PickerDayDemoCSSVars() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['StaticDatePicker']}>
        <StaticDatePicker
          sx={{
            '--PickerDay-size': '24px',
            '--PickerDay-horizontalMargin': '4px',
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { pickerDayClasses } from '@mui/x-date-pickers/PickerDay';

export default function PickerDayDemoCSSVars() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['StaticDatePicker']}>
        <StaticDatePicker
          sx={{
            [`& .${pickerDayClasses.root}`]: {
              '--PickerDay-horizontalMargin': '8px',
              '--PickerDay-size': '24px',
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

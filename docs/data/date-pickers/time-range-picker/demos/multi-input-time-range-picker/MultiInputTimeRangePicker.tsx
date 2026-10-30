import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export default function MultiInputTimeRangePicker() {
  return (
    // @focus-start @padding 2
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MultiInputTimeRangeField']}>
        <TimeRangePicker slots={{ field: MultiInputTimeRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
    // @focus-end
  );
}

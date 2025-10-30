import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');

export default function DateValidationMaxDate() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DatePicker',
          'DateTimePicker',
          'DateRangePicker',
          'DateTimeRangePicker',
        ]}
      >
        <DemoItem label="DatePicker">
          <DatePicker
            defaultValue={today}
            maxDate={yesterday}
            views={['year', 'month', 'day']}
          />
        </DemoItem>
        <DemoItem label="DateTimePicker">
          <DateTimePicker
            defaultValue={today}
            maxDate={yesterday}
            views={['year', 'month', 'day', 'hours', 'minutes']}
          />
        </DemoItem>
        <DemoItem label="DateRangePicker" component="DateRangePicker">
          <DateRangePicker defaultValue={[yesterday, today]} maxDate={yesterday} />
        </DemoItem>
        <DemoItem label="DateTimeRangePicker" component="DateTimeRangePicker">
          <DateTimeRangePicker
            defaultValue={[yesterday, today]}
            maxDate={yesterday}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

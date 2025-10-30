import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function SecondsTimePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker', 'TimePicker']}>
        <TimePicker
          label="Hours, minutes and seconds"
          views={['hours', 'minutes', 'seconds']}
          format="HH:mm:ss"
          defaultValue={dayjs('2022-04-17T15:30:10')}
        />
        <TimePicker
          label="Minutes and seconds"
          views={['minutes', 'seconds']}
          openTo="minutes"
          format="mm:ss"
          defaultValue={dayjs('2022-04-17T15:30:10')}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

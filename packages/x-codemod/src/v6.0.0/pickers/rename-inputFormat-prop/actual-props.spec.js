import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const isoFormat = 'YYYY-MM-DD';

<div>
  <DatePicker inputFormat={isoFormat} />
  <TimePicker inputFormat="HH:mm" />
  <input inputFormat="YYYY-MM-DD" />
</div>;

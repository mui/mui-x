import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const shouldDisable = (timeValue, view) => view === 'hours' && timeValue < 12;

<div>
  <DateTimePicker shouldDisableTime={(timeValue, view) => view === 'hours' && timeValue < 12} />
  <TimePicker shouldDisableTime={shouldDisable} />
</div>;

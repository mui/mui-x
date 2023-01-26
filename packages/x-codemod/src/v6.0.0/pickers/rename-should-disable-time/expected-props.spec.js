import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

<div>
  <DateTimePicker shouldDisableClock={(timeValue, view) => view === 'hours' && timeValue < 12} />
</div>;

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

<div>
  <DateTimePicker shouldDisableTime={(timeValue, view) => view === 'hours' && timeValue < 12} />
</div>;

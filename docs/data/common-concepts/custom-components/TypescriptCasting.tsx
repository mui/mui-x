import * as React from 'react';
import { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateCalendar,
  DateCalendarSlots,
  DateCalendarSlotProps,
} from '@mui/x-date-pickers/DateCalendar';
import { PropsFromSlot } from '@mui/x-date-pickers/models';
import { PickersCalendarHeader } from '@mui/x-date-pickers/PickersCalendarHeader';

function DisplayWeekNumberToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <FormControlLabel
      sx={{ ml: 2 }}
      control={
        <Switch
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
        />
      }
      label="Display week number"
    />
  );
}

interface CustomCalendarHeaderProps
  extends PropsFromSlot<DateCalendarSlots<Dayjs>['calendarHeader']> {
  displayWeekNumber: boolean;
  setDisplayWeekNumber: (displayWeekNumber: boolean) => void;
}

function CustomCalendarHeader({
  displayWeekNumber,
  setDisplayWeekNumber,
  ...other
}: CustomCalendarHeaderProps) {
  return (
    <Stack>
      <DisplayWeekNumberToggle
        value={displayWeekNumber}
        onChange={setDisplayWeekNumber}
      />
      <PickersCalendarHeader {...other} />
    </Stack>
  );
}

export default function TypescriptCasting() {
  const [displayWeekNumber, setDisplayWeekNumber] = React.useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        displayWeekNumber={displayWeekNumber}
        // Cast the custom component to the type expected by the X component
        slots={{
          calendarHeader:
            CustomCalendarHeader as DateCalendarSlots<Dayjs>['calendarHeader'],
        }}
        slotProps={{
          calendarHeader: {
            displayWeekNumber,
            setDisplayWeekNumber,
          } as DateCalendarSlotProps<Dayjs>['calendarHeader'],
        }}
      />
    </LocalizationProvider>
  );
}

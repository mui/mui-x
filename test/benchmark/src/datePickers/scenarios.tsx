import * as React from 'react';
import * as ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';
import { ElementTiming } from '@mui/internal-benchmark/page';
import type { InteractionContext } from '@mui/internal-benchmark/page';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { defineScenario } from '../utils/scenario';

// The adapter supports timezones only with these plugins. They apply to the whole page, so all the
// date scenarios run with them.
dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

// Fixed dates, so every sample renders the same days.
const day = dayjs('2025-07-15');
const range: [dayjs.Dayjs, dayjs.Dayjs] = [dayjs('2025-07-10'), dayjs('2025-08-05')];

export const dateCalendar = defineScenario('DateCalendar', () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateCalendar defaultValue={day} referenceDate={day} />
  </LocalizationProvider>
));

export const dateCalendarNamedTimezone = defineScenario('DateCalendar in a named timezone', () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateCalendar timezone="America/New_York" defaultValue={day} referenceDate={day} />
  </LocalizationProvider>
));

// Values without a timezone name have an offset only outside UTC, and CI runs in UTC: the
// interaction moves the page to this timezone, then renders the calendar.
const SYSTEM_TIMEZONE = 'America/New_York';
const CALENDAR_PAINT = 'calendar';
let showSystemTimezoneCalendar: (() => void) | undefined;

function SystemTimezoneCalendar() {
  const [value, setValue] = React.useState<dayjs.Dayjs | null>(null);
  React.useLayoutEffect(() => {
    // Without a timezone name, `dayjs.tz()` gives the value of an empty picker: the system offset.
    showSystemTimezoneCalendar = () => setValue(dayjs.tz('2025-07-15'));
  }, []);

  if (!value) {
    return null;
  }
  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar defaultValue={value} referenceDate={value} />
      </LocalizationProvider>
      <ElementTiming name={CALENDAR_PAINT} />
    </React.Fragment>
  );
}

async function showInSystemTimezone({
  cdp,
  resumeReactRecording,
  waitForElementTiming,
}: InteractionContext) {
  await cdp.send('Emulation.setTimezoneOverride', { timezoneId: SYSTEM_TIMEZONE });
  try {
    if (new Date(2025, 6, 15).getTimezoneOffset() !== 240) {
      throw new Error(`The page is not in ${SYSTEM_TIMEZONE}, so the values have no offset.`);
    }
    resumeReactRecording();
    ReactDOM.flushSync(() => showSystemTimezoneCalendar?.());
    await waitForElementTiming(CALENDAR_PAINT);
  } finally {
    // The override stays on the tab: give the host timezone back to the other scenarios.
    await cdp.send('Emulation.setTimezoneOverride', { timezoneId: '' });
  }
}

export const dateCalendarSystemTimezone = defineScenario(
  'DateCalendar in the system timezone',
  () => <SystemTimezoneCalendar />,
  showInSystemTimezone,
  { reactRecordingPaused: true },
);

export const dateRangeCalendar = defineScenario('DateRangeCalendar with 2 months', () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateRangeCalendar defaultValue={range} referenceDate={range[0]} calendars={2} />
  </LocalizationProvider>
));

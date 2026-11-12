import { onTestFinished } from 'vitest';
import { resetSystemTimezoneId } from '@mui/x-scheduler-internals/internals';

/**
 * Changes the timezone of the system until the end of the current test.
 * Only works in JSDOM: browsers cannot change their timezone through `process.env.TZ`.
 */
export function setSystemTimezone(timezone: string) {
  const previousTimezone = process.env.TZ;
  process.env.TZ = timezone;
  // The Scheduler reads the identifier of the timezone of the system once.
  resetSystemTimezoneId();
  onTestFinished(() => {
    if (previousTimezone === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = previousTimezone;
    }
    resetSystemTimezoneId();
  });
}

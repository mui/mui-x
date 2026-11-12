import { onTestFinished } from 'vitest';

/**
 * Changes the timezone of the system until the end of the current test.
 * Only works in JSDOM: browsers cannot change their timezone through `process.env.TZ`.
 */
export function setSystemTimezone(timezone: string) {
  const previousTimezone = process.env.TZ;
  process.env.TZ = timezone;
  onTestFinished(() => {
    if (previousTimezone === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = previousTimezone;
    }
  });
}

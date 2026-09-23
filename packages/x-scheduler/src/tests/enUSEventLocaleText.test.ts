import {
  DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT,
  getEventAccessibleName,
} from '@mui/x-scheduler-internals/internals';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { enUS } from '../locales/enUS';
import type { SchedulerEventLocaleText } from '../models/translations';

describe('enUS', () => {
  const shipped = enUS.components.MuiEventCalendar.defaultProps
    .localeText as SchedulerEventLocaleText;

  // The headless primitives fall back to their own English vocabulary, which the l10n script
  // cannot read from `enUS`. Every sentence must come out the same through both.
  function bothNames(occurrence: ReturnType<EventBuilder['toOccurrence']>, isRecurring: boolean) {
    const parameters = { occurrence, adapter, ampm: true, isRecurring, resourceName: 'Sport' };
    return [
      getEventAccessibleName({ ...parameters, localeText: shipped }),
      getEventAccessibleName({
        ...parameters,
        localeText: DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT,
      }),
    ];
  }

  it('should name events the same way as the headless default', () => {
    const timed = EventBuilder.new()
      .title('Running')
      .startAt('2025-07-03T07:30:00')
      .endAt('2025-07-03T08:30:00')
      .toOccurrence();
    const [shippedTimed, defaultTimed] = bothNames(timed, true);
    expect(shippedTimed).to.equal(defaultTimed);
    expect(shippedTimed).to.equal(
      'Running, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025, Resource: Sport, Recurring',
    );

    const allDay = EventBuilder.new()
      .title('Conference')
      .span('2025-07-03', '2025-07-05', { allDay: true })
      .toOccurrence();
    const [shippedAllDay, defaultAllDay] = bothNames(allDay, false);
    expect(shippedAllDay).to.equal(defaultAllDay);
    expect(shippedAllDay).to.equal(
      'Conference, All day, From Thursday, July 3rd, 2025 to Saturday, July 5th, 2025, Resource: Sport',
    );
  });
});

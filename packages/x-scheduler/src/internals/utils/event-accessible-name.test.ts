import { adapter, EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { enUS } from '../../locales/enUS';
import type { SchedulerEventLocaleText } from '../../models/translations';
import { getEventAccessibleName } from './event-accessible-name';

const localeText = enUS.components.MuiEventCalendar.defaultProps
  .localeText as SchedulerEventLocaleText;

function timedOccurrence(title: string, start: string, end: string) {
  return EventBuilder.new().title(title).startAt(start).endAt(end).toOccurrence();
}

function getName(
  occurrence: ReturnType<EventBuilder['toOccurrence']>,
  overrides: Partial<Omit<Parameters<typeof getEventAccessibleName>[0], 'occurrence'>> = {},
) {
  return getEventAccessibleName({
    occurrence,
    adapter,
    ampm: true,
    localeText,
    isRecurring: false,
    ...overrides,
  });
}

describe('getEventAccessibleName', () => {
  // 2025-07-03 is a Thursday.
  it('should announce the title, the time range and the date of a timed event', () => {
    const occurrence = timedOccurrence('Running', '2025-07-03T07:30:00', '2025-07-03T08:30:00');

    expect(getName(occurrence)).to.equal('Running, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025');
  });

  it('should format the time range in 24-hour format when ampm is false', () => {
    const occurrence = timedOccurrence('Running', '2025-07-03T16:00:00', '2025-07-03T17:00:00');

    expect(getName(occurrence, { ampm: false })).to.equal(
      'Running, 16:00 to 17:00, Thursday, July 3rd, 2025',
    );
  });

  it('should announce "All day" instead of a time range for a single-day all-day event', () => {
    const occurrence = EventBuilder.new().title('Conference').fullDay('2025-07-03').toOccurrence();

    expect(getName(occurrence)).to.equal('Conference, All day, Thursday, July 3rd, 2025');
  });

  it('should announce the date range of a multi-day all-day event', () => {
    const occurrence = EventBuilder.new()
      .title('Conference')
      .span('2025-07-03', '2025-07-05', { allDay: true })
      .toOccurrence();

    expect(getName(occurrence)).to.equal(
      'Conference, All day, From Thursday, July 3rd, 2025 to Saturday, July 5th, 2025',
    );
  });

  it('should announce the date and time range of a multi-day timed event', () => {
    const occurrence = timedOccurrence('Trip', '2025-07-03T07:30:00', '2025-07-05T17:00:00');

    expect(getName(occurrence)).to.equal(
      'Trip, From Thursday, July 3rd, 2025 7:30 AM to Saturday, July 5th, 2025 5:00 PM',
    );
  });

  it('should append the resource when a resource name is provided', () => {
    const occurrence = timedOccurrence('Running', '2025-07-03T07:30:00', '2025-07-03T08:30:00');

    expect(getName(occurrence, { resourceName: 'Sport' })).to.equal(
      'Running, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025, Resource: Sport',
    );
  });

  it('should append "Recurring" for a recurring event', () => {
    const occurrence = timedOccurrence('Running', '2025-07-03T07:30:00', '2025-07-03T08:30:00');

    expect(getName(occurrence, { isRecurring: true })).to.equal(
      'Running, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025, Recurring',
    );
  });

  it('should use the provided locale text for every sentence', () => {
    const occurrence = timedOccurrence('Correr', '2025-07-03T07:30:00', '2025-07-03T08:30:00');

    const esLocaleText = {
      ...localeText,
      eventAriaLabelTimeRange: (start: string, end: string) => `de ${start} a ${end}`,
      eventAriaLabelRecurring: 'Recurrente',
      resourceAriaLabel: (name: string) => `Recurso: ${name}`,
    };

    expect(
      getName(occurrence, { localeText: esLocaleText, isRecurring: true, resourceName: 'Deporte' }),
    ).to.equal(
      'Correr, de 7:30 AM a 8:30 AM, Thursday, July 3rd, 2025, Recurso: Deporte, Recurrente',
    );
  });

  it('should skip an empty title instead of announcing a leading separator', () => {
    const occurrence = timedOccurrence('', '2025-07-03T07:30:00', '2025-07-03T08:30:00');

    expect(getName(occurrence)).to.equal('7:30 AM to 8:30 AM, Thursday, July 3rd, 2025');
  });

  it('should let the locale reorder the parts through eventAriaLabel', () => {
    const occurrence = timedOccurrence('Running', '2025-07-03T07:30:00', '2025-07-03T08:30:00');

    const reorderingLocaleText: SchedulerEventLocaleText = {
      ...localeText,
      eventAriaLabel: ({ title, when, date }) => `${date} ${when} ${title}`,
    };

    expect(getName(occurrence, { localeText: reorderingLocaleText })).to.equal(
      'Thursday, July 3rd, 2025 7:30 AM to 8:30 AM Running',
    );
  });

  it('should announce the day and time in the display timezone', () => {
    const occurrence = EventBuilder.new()
      .title('Late call')
      .startAt('2025-07-03T23:30:00Z')
      .endAt('2025-07-04T00:30:00Z')
      .withDisplayTimezone('Asia/Tokyo')
      .toOccurrence();

    expect(getName(occurrence)).to.equal('Late call, 8:30 AM to 9:30 AM, Friday, July 4th, 2025');
  });
});

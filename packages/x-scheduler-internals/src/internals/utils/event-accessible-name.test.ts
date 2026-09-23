import { adapter, EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import {
  DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT as localeText,
  getEventAccessibleName,
} from './event-accessible-name';

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
    const occurrence = EventBuilder.new()
      .title('Running')
      .startAt('2025-07-03T07:30:00')
      .endAt('2025-07-03T08:30:00')
      .toOccurrence();

    expect(getName(occurrence)).to.equal('Running, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025');
  });

  it('should format the time range in 24-hour format when ampm is false', () => {
    const occurrence = EventBuilder.new()
      .title('Running')
      .startAt('2025-07-03T16:00:00')
      .endAt('2025-07-03T17:00:00')
      .toOccurrence();

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
    const occurrence = EventBuilder.new()
      .title('Trip')
      .startAt('2025-07-03T07:30:00')
      .endAt('2025-07-05T17:00:00')
      .toOccurrence();

    expect(getName(occurrence)).to.equal(
      'Trip, From Thursday, July 3rd, 2025 7:30 AM to Saturday, July 5th, 2025 5:00 PM',
    );
  });

  it('should append the resource when a resource name is provided', () => {
    const occurrence = EventBuilder.new()
      .title('Running')
      .startAt('2025-07-03T07:30:00')
      .endAt('2025-07-03T08:30:00')
      .toOccurrence();

    expect(getName(occurrence, { resourceName: 'Sport' })).to.equal(
      'Running, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025, Resource: Sport',
    );
  });

  it('should append "Recurring" for a recurring event', () => {
    const occurrence = EventBuilder.new()
      .title('Running')
      .startAt('2025-07-03T07:30:00')
      .endAt('2025-07-03T08:30:00')
      .toOccurrence();

    expect(getName(occurrence, { isRecurring: true })).to.equal(
      'Running, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025, Recurring',
    );
  });

  it('should use the provided locale text for every sentence', () => {
    const occurrence = EventBuilder.new()
      .title('Correr')
      .startAt('2025-07-03T07:30:00')
      .endAt('2025-07-03T08:30:00')
      .toOccurrence();

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
    const occurrence = EventBuilder.new()
      .title('')
      .startAt('2025-07-03T07:30:00')
      .endAt('2025-07-03T08:30:00')
      .toOccurrence();

    expect(getName(occurrence)).to.equal('7:30 AM to 8:30 AM, Thursday, July 3rd, 2025');
  });

  it('should let the locale reorder the parts through eventAriaLabel', () => {
    const occurrence = EventBuilder.new()
      .title('Running')
      .startAt('2025-07-03T07:30:00')
      .endAt('2025-07-03T08:30:00')
      .toOccurrence();

    const reorderingLocaleText = {
      ...localeText,
      eventAriaLabel: ({ title, when, date }: { title: string; when: string; date?: string }) =>
        `${date} ${when} ${title}`,
    };

    expect(getName(occurrence, { localeText: reorderingLocaleText })).to.equal(
      'Thursday, July 3rd, 2025 7:30 AM to 8:30 AM Running',
    );
  });
});

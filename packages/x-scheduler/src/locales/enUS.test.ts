import { DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT } from '@mui/x-scheduler-internals/internals';
import { describe, it, expect } from 'vitest';
import { enUS } from './enUS';
import type { SchedulerEventLocaleText } from '../models/translations';

describe('enUS', () => {
  it('should keep the event name strings in sync with the headless default', () => {
    const shipped = enUS.components.MuiEventCalendar.defaultProps
      .localeText as SchedulerEventLocaleText;
    const fallback = DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT;
    const parts = {
      title: 'Running',
      when: '7:30 AM to 8:30 AM',
      date: 'Monday, May 26th, 2025',
      resource: 'Resource: Sport',
      recurring: 'Recurring',
    };

    expect(Object.keys(shipped)).to.include.members(Object.keys(fallback));
    expect(shipped.eventAriaLabelTimeRange('a', 'b')).to.equal(
      fallback.eventAriaLabelTimeRange('a', 'b'),
    );
    expect(shipped.eventAriaLabelDateRange('a', 'b')).to.equal(
      fallback.eventAriaLabelDateRange('a', 'b'),
    );
    expect(shipped.eventAriaLabelAllDay).to.equal(fallback.eventAriaLabelAllDay);
    expect(shipped.eventAriaLabelRecurring).to.equal(fallback.eventAriaLabelRecurring);
    expect(shipped.resourceAriaLabel('Sport')).to.equal(fallback.resourceAriaLabel('Sport'));
    expect(shipped.eventAriaLabel(parts)).to.equal(fallback.eventAriaLabel(parts));
    expect(shipped.eventAriaLabel({ title: 'Running', when: 'All day' })).to.equal(
      fallback.eventAriaLabel({ title: 'Running', when: 'All day' }),
    );
  });
});

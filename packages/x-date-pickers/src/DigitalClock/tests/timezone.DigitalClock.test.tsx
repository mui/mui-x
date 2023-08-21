import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { screen, userEvent } from '@mui/monorepo/test/utils';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { describeAdapters } from '@mui/x-date-pickers/tests/describeAdapters';
import { getDateOffset } from 'test/utils/pickers';

const TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];

const get24HourFromDigitalClock = () => {
  const results = /([0-9]+):([0-9]+) (AM|PM)/.exec(
    screen.queryByRole('option', { selected: true })!.innerHTML,
  )!;

  return Number(results[1]) + (results[3] === 'AM' ? 0 : 12);
};

describe('<DigitalClock /> - Timezone', () => {
  describeAdapters('Timezone prop', DigitalClock, ({ adapter, render }) => {
    if (!adapter.isTimezoneCompatible) {
      return;
    }

    it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', () => {
      const onChange = spy();
      render(<DigitalClock onChange={onChange} />);

      userEvent.mousePress(screen.getByRole('option', { name: '08:00 AM' }));

      const expectedDate = adapter.setHours(adapter.dateWithTimezone(undefined, 'default')!, 8);

      // Check the `onChange` value (uses default timezone, e.g: UTC, see TZ env variable)
      const actualDate = onChange.lastCall.firstArg;

      // On dayjs, we are not able to know if a date is UTC because it's the system timezone or because it was created as UTC.
      // In a real world scenario, this should probably never occur.
      expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
      expect(actualDate).toEqualDateTime(expectedDate);
    });

    TIMEZONE_TO_TEST.forEach((timezone) => {
      describe(`Timezone: ${timezone}`, () => {
        it('should use timezone prop for onChange when no value is provided', () => {
          const onChange = spy();
          render(<DigitalClock onChange={onChange} timezone={timezone} />);

          userEvent.mousePress(screen.getByRole('option', { name: '08:00 AM' }));

          const expectedDate = adapter.setHours(
            adapter.startOfDay(adapter.dateWithTimezone(undefined, timezone)!),
            8,
          );

          // Check the `onChange` value (uses timezone prop)
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });

        it('should use timezone prop for rendering and value timezone for onChange when a value is provided', () => {
          const onChange = spy();
          const value = adapter.dateWithTimezone('2022-04-17T04:30', timezone);

          render(
            <DigitalClock defaultValue={value} onChange={onChange} timezone="America/Chicago" />,
          );

          const renderedHourBefore = get24HourFromDigitalClock();

          const offsetDiff =
            getDateOffset(adapter, adapter.setTimezone(value, 'America/Chicago')) -
            getDateOffset(adapter, value);

          expect(renderedHourBefore).to.equal(
            (adapter.getHours(value) + offsetDiff / 60 + 24) % 24,
          );

          userEvent.mousePress(screen.getByRole('option', { name: '08:30 PM' }));

          const actualDate = onChange.lastCall.firstArg;

          const renderedHourAfter = get24HourFromDigitalClock();
          expect(renderedHourAfter).to.equal(
            (adapter.getHours(actualDate) + offsetDiff / 60 + 24) % 24,
          );

          const expectedDate = adapter.addHours(value, renderedHourAfter - renderedHourBefore);

          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });
      });
    });
  });
});

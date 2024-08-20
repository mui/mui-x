import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { describeAdapters } from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];

describe('<DateCalendar /> - Timezone', () => {
  describeAdapters('Timezone prop', DateCalendar, ({ adapter, render }) => {
    if (!adapter.isTimezoneCompatible) {
      return;
    }

    it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', () => {
      const onChange = spy();
      render(<DateCalendar onChange={onChange} />);

      fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '25' }));
      const expectedDate = adapter.setDate(adapter.date(undefined, 'default'), 25);

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
          render(<DateCalendar onChange={onChange} timezone={timezone} />);
          fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '25' }));
          const expectedDate = adapter.setDate(
            adapter.startOfDay(adapter.date(undefined, timezone)),
            25,
          );

          // Check the `onChange` value (uses timezone prop)
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });

        it('should use value timezone for onChange when a value is provided', () => {
          const onChange = spy();
          const value = adapter.date('2022-04-25T15:30', timezone);

          render(<DateCalendar value={value} onChange={onChange} timezone="America/Chicago" />);

          fireUserEvent.mousePress(screen.getByRole('gridcell', { name: '25' }));
          const expectedDate = adapter.setDate(value, 25);

          // Check the `onChange` value (uses timezone prop)
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });
      });
    });
  });
});

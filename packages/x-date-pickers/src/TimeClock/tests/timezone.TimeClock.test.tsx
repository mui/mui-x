import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { screen, fireTouchChangedEvent } from '@mui/internal-test-utils';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import {
  getClockTouchEvent,
  getTimeClockValue,
  getDateOffset,
  describeAdapters,
} from 'test/utils/pickers';

const TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];

describe('<TimeClock /> - Timezone', () => {
  describeAdapters('Timezone prop', TimeClock, ({ adapter, render }) => {
    if (!adapter.isTimezoneCompatible) {
      return;
    }

    it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', () => {
      const onChange = spy();
      render(<TimeClock onChange={onChange} />);

      const hourClockEvent = getClockTouchEvent(8, '12hours');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      const expectedDate = adapter.setHours(adapter.date(), 8);

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
          render(<TimeClock onChange={onChange} timezone={timezone} />);

          const hourClockEvent = getClockTouchEvent(8, '12hours');
          fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
          fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

          const expectedDate = adapter.setHours(
            adapter.startOfDay(adapter.date(undefined, timezone)),
            8,
          );

          // Check the `onChange` value (uses timezone prop)
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });

        it('should use timezone prop for rendering and value timezone for onChange when a value is provided', () => {
          const onChange = spy();
          const value = adapter.date('2022-04-17T04:30', timezone);

          render(
            <TimeClock
              defaultValue={value}
              onChange={onChange}
              timezone="America/Chicago"
              views={['hours']}
            />,
          );

          const renderedHourBefore = getTimeClockValue();
          const offsetDiff =
            getDateOffset(adapter, adapter.setTimezone(value, 'America/Chicago')) -
            getDateOffset(adapter, value);

          expect(renderedHourBefore).to.equal(
            (adapter.getHours(value) + offsetDiff / 60 + 12) % 12,
          );

          const hourClockEvent = getClockTouchEvent(8, '12hours');
          fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
          fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

          const actualDate = onChange.lastCall.firstArg;

          const renderedHourAfter = getTimeClockValue();
          expect(renderedHourAfter).to.equal(
            (adapter.getHours(actualDate) + offsetDiff / 60 + 12) % 12,
          );

          const expectedDate = adapter.addHours(value, renderedHourAfter - renderedHourBefore);

          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });
      });
    });
  });
});

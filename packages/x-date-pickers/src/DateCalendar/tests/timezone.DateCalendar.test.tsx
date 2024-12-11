import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { describeAdapters } from 'test/utils/pickers';
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

      fireEvent.click(screen.getByRole('gridcell', { name: '25' }));
      const expectedDate = adapter.setDate(adapter.date(undefined, 'default'), 25);

      // Check the `onChange` value (uses default timezone, for example: UTC, see TZ env variable)
      const actualDate = onChange.lastCall.firstArg;

      // On dayjs, we are not able to know if a date is UTC because it's the system timezone or because it was created as UTC.
      // In a real world scenario, this should probably never occur.
      expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
      expect(actualDate).toEqualDateTime(expectedDate);
    });

    it('should use "default" timezone for onChange when provided', () => {
      const onChange = spy();
      const value = adapter.date('2022-04-25T15:30');

      render(<DateCalendar value={value} onChange={onChange} timezone="default" />);

      fireEvent.click(screen.getByRole('gridcell', { name: '25' }));
      const expectedDate = adapter.setDate(value, 25);

      // Check the `onChange` value (uses timezone prop)
      const actualDate = onChange.lastCall.firstArg;
      expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
      expect(actualDate).toEqualDateTime(expectedDate);
    });

    it('should correctly render month days when timezone changes', () => {
      function DateCalendarWithControlledTimezone() {
        const [timezone, setTimezone] = React.useState('Europe/Paris');
        return (
          <React.Fragment>
            <DateCalendar timezone={timezone} />
            <button onClick={() => setTimezone('America/New_York')}>Switch timezone</button>
          </React.Fragment>
        );
      }
      render(<DateCalendarWithControlledTimezone />);

      expect(
        screen.getAllByRole('gridcell', {
          name: (_, element) => element.nodeName === 'BUTTON',
        }).length,
      ).to.equal(30);

      fireEvent.click(screen.getByRole('button', { name: 'Switch timezone' }));

      // the amount of rendered days should remain the same after changing timezone
      expect(
        screen.getAllByRole('gridcell', {
          name: (_, element) => element.nodeName === 'BUTTON',
        }).length,
      ).to.equal(30);
    });

    // See https://github.com/mui/mui-x/issues/14730
    it('should not render duplicate days when leaving DST in America/Asuncion', () => {
      render(<DateCalendar timezone="America/Asuncion" value={adapter.date('2024-10-10')} />);
      expect(screen.getAllByRole('gridcell', { name: '5' })).to.have.length(1);
    });

    TIMEZONE_TO_TEST.forEach((timezone) => {
      describe(`Timezone: ${timezone}`, () => {
        it('should use timezone prop for onChange when no value is provided', () => {
          const onChange = spy();
          render(<DateCalendar onChange={onChange} timezone={timezone} />);
          fireEvent.click(screen.getByRole('gridcell', { name: '25' }));
          const expectedDate = adapter.setDate(
            adapter.startOfDay(adapter.date(undefined, timezone)),
            25,
          );

          // Check the `onChange` value (uses timezone prop)
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(
            adapter.lib === 'dayjs' && timezone === 'system' ? 'UTC' : timezone,
          );
          expect(actualDate).toEqualDateTime(expectedDate);
        });

        it('should use value timezone for onChange when a value is provided', () => {
          const onChange = spy();
          const value = adapter.date('2022-04-25T15:30', timezone);

          render(<DateCalendar value={value} onChange={onChange} timezone="America/Chicago" />);

          fireEvent.click(screen.getByRole('gridcell', { name: '25' }));
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

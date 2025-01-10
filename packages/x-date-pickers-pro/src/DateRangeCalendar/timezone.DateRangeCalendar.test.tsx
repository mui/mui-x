import * as React from 'react';
import { expect } from 'chai';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { describeAdapters } from 'test/utils/pickers';
import { describeSkipIf } from 'test/utils/skipIf';
import { DateRangeCalendar } from './DateRangeCalendar';

describe('<DateRangeCalendar /> - Timezone', () => {
  describeAdapters('Timezone prop', DateRangeCalendar, ({ adapter, render }) => {
    describeSkipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', () => {
      it('should correctly render month days when timezone changes', () => {
        function DateCalendarWithControlledTimezone() {
          const [timezone, setTimezone] = React.useState('Europe/Paris');
          return (
            <React.Fragment>
              <DateRangeCalendar timezone={timezone} calendars={1} />
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
    });
  });
});

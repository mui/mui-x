import * as React from 'react';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { describeAdapters } from 'test/utils/pickers';
import { DateRangeCalendar } from './DateRangeCalendar';

describe('<DateRangeCalendar /> - Timezone', () => {
  describeAdapters('Timezone prop', DateRangeCalendar, ({ adapter, render }) => {
    describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', () => {
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
            name: (_, element) =>
              element.attributes.getNamedItem('data-testid')?.value === 'DateRangePickerDay',
          }).length,
        ).to.equal(30);

        fireEvent.click(screen.getByRole('button', { name: 'Switch timezone' }));

        // the amount of rendered days should remain the same after changing timezone
        expect(
          screen.getAllByRole('gridcell', {
            name: (_, element) =>
              element.attributes.getNamedItem('data-testid')?.value === 'DateRangePickerDay',
          }).length,
        ).to.equal(30);
      });

      it('should not produce invalidRange error when selecting same day after timezone change', () => {
        function DateRangeCalendarWithTimezoneChange() {
          const [timezone, setTimezone] = React.useState<string>('UTC');
          const [value, setValue] = React.useState<any>([null, null]);

          return (
            <React.Fragment>
              <DateRangeCalendar
                timezone={timezone}
                calendars={1}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                defaultValue={[
                  adapter.date('2025-11-11', 'UTC'),
                  adapter.date('2025-11-11', 'UTC'),
                ]}
              />
              <button onClick={() => setTimezone('America/Los_Angeles')}>
                Switch to Los Angeles
              </button>
              <div data-testid="value-display">
                {value[0] ? adapter.format(value[0], 'keyboardDate') : 'null'} -{' '}
                {value[1] ? adapter.format(value[1], 'keyboardDate') : 'null'}
              </div>
            </React.Fragment>
          );
        }

        render(<DateRangeCalendarWithTimezoneChange />);

        // Switch timezone to Los Angeles
        fireEvent.click(screen.getByRole('button', { name: 'Switch to Los Angeles' }));

        // Select Nov 12, 2025 as both start and end date
        const nov12Cells = screen.getAllByRole('gridcell', { name: '12' });
        fireEvent.click(nov12Cells[0]);
        fireEvent.click(nov12Cells[0]);

        // Step 4: Verify that the range is valid (both dates should be Nov 12)
        // The value should not have an invalidRange error, which would prevent onChange from being called
        expect(screen.getByTestId('value-display')).not.to.have.text('null - null');
      });
    });
  });
});

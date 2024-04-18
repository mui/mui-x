import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { userEvent, screen } from '@mui-internal/test-utils';
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

      userEvent.mousePress(screen.getByRole('gridcell', { name: '25' }));
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
          userEvent.mousePress(screen.getByRole('gridcell', { name: '25' }));
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

          userEvent.mousePress(screen.getByRole('gridcell', { name: '25' }));
          const expectedDate = adapter.setDate(value, 25);

          // Check the `onChange` value (uses timezone prop)
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });

        it('on timezone change the rendered UI should display the Calendar of same month', () => {
          // Render the component with initial timezone prop
          const { rerender } = render(<DateCalendar timezone="UTC" />);

          // Create a map of buttons with their indices for the initial render
          const renderButtonsMap = {};
          screen.getAllByRole('gridcell').forEach((element, index) => {
            if (element.tagName.toLowerCase() === 'button' && element && element.textContent) {
              const numberMatch = element.textContent.trim().match(/\d+/);
              if (numberMatch) {
                const number = parseInt(numberMatch[0], 10);
                renderButtonsMap[index] = number;
              }
            }
          });

          // Rerender the component with a different timezone prop
          rerender(<DateCalendar timezone={timezone} />);

          // Create a map of buttons with their indices for the rerender
          const reRenderButtonsMap = {};

          screen.getAllByRole('gridcell').forEach((element, index) => {
            if (element.tagName.toLowerCase() === 'button' && element && element.textContent) {
              const numberMatch = element.textContent.trim().match(/\d+/);
              if (numberMatch) {
                const number = parseInt(numberMatch[0], 10);
                reRenderButtonsMap[index] = number;
              }
            }
          });

          // Ensure the number of buttons and their numbers are consistent
          expect(Object.keys(reRenderButtonsMap).length).equals(
            Object.keys(renderButtonsMap).length,
          );
          Object.keys(renderButtonsMap).forEach((index) => {
            expect(reRenderButtonsMap[index]).equals(renderButtonsMap[index]);
          });
        });

        it('on timezone change the difference between the selected date change should be at max 1', () => {
          // Render the component with initial timezone prop
          const { rerender } = render(<DateCalendar timezone="UTC" />);

          const renderButtons = screen
            .getAllByRole('gridcell')
            .filter((button) => button.tagName.toLowerCase() === 'button');

          const mid = renderButtons.length / 2;

          userEvent.mousePress(renderButtons[mid]);

          rerender(<DateCalendar timezone={timezone} />);

          const reRenderButtons = screen
            .getAllByRole('gridcell')
            .filter((button) => button.tagName.toLowerCase() === 'button');

          const selectedButtonIndex = reRenderButtons.findIndex((button) =>
            button.classList.contains('Mui-selected'),
          );

          const differenceOfIndex = Math.abs(mid - selectedButtonIndex);

          expect(differenceOfIndex).lessThanOrEqual(1);
        });
      });
    });
  });
});

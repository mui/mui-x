import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { userEvent } from '@mui/monorepo/test/utils';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { createPickerRenderer, expectInputValue, getTextbox } from 'test/utils/pickers';
import { describeAdapters } from '@mui/x-date-pickers/tests/describeAdapters';

const TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];

describe('<DateTimeField /> - Timezone', () => {
  describeAdapters('Timezone prop', DateTimeField, ({ adapter, render, clickOnInput }) => {
    if (!adapter.isTimezoneCompatible) {
      return;
    }

    const format = `${adapter.formats.keyboardDate} ${adapter.formats.hours24h}`;

    const fillEmptyValue = (input: HTMLInputElement, timezone: string) => {
      clickOnInput(input, 0);

      // Set month
      userEvent.keyPress(input, { key: 'ArrowDown' });
      userEvent.keyPress(input, { key: 'ArrowRight' });

      // Set day
      userEvent.keyPress(input, { key: 'ArrowDown' });
      userEvent.keyPress(input, { key: 'ArrowRight' });

      // Set year
      userEvent.keyPress(input, { key: 'ArrowDown' });
      userEvent.keyPress(input, { key: 'ArrowRight' });

      // Set hours
      userEvent.keyPress(input, { key: 'ArrowDown' });
      userEvent.keyPress(input, { key: 'ArrowRight' });

      return adapter.setHours(
        adapter.setDate(adapter.setMonth(adapter.dateWithTimezone(undefined, timezone)!, 11), 31),
        23,
      );
    };

    it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', () => {
      if (adapter.lib !== 'dayjs') {
        return;
      }

      const onChange = spy();
      render(<DateTimeField onChange={onChange} format={format} />);

      const input = getTextbox();
      const expectedDate = fillEmptyValue(input, 'default');

      // Check the rendered value (uses default timezone, e.g: UTC, see TZ env variable)
      expectInputValue(input, '12/31/2022 23');

      // Check the `onChange` value (uses default timezone, e.g: UTC, see TZ env variable)
      const actualDate = onChange.lastCall.firstArg;

      // On dayjs, we are not able to know if a date is UTC because it's the system timezone or because it was created as UTC.
      // In a real world scenario, this should probably never occur.
      expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
      expect(actualDate).toEqualDateTime(expectedDate);
    });

    TIMEZONE_TO_TEST.forEach((timezone) => {
      describe(`Timezone: ${timezone}`, () => {
        it('should use timezone prop for onChange and rendering when no value is provided', () => {
          const onChange = spy();
          render(<DateTimeField onChange={onChange} timezone={timezone} format={format} />);
          const input = getTextbox();
          const expectedDate = fillEmptyValue(input, timezone);

          // Check the rendered value (uses timezone prop)
          expectInputValue(input, '12/31/2022 23');

          // Check the `onChange` value (uses timezone prop)
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });

        it('should use timezone prop for rendering and value timezone for onChange when a value is provided', () => {
          const onChange = spy();
          render(
            <DateTimeField
              value={adapter.dateWithTimezone(undefined, timezone)}
              onChange={onChange}
              timezone="America/Chicago"
              format={format}
            />,
          );
          const input = getTextbox();
          clickOnInput(input, 0);
          userEvent.keyPress(input, { key: 'ArrowDown' });

          // Check the rendered value (uses America/Chicago timezone)
          expectInputValue(input, '05/14/2022 19');

          // Check the `onChange` value (uses timezone prop)
          const expectedDate = adapter.addMonths(
            adapter.dateWithTimezone(undefined, timezone)!,
            -1,
          );
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });
      });
    });
  });

  describe('Value timezone modification - Luxon', () => {
    const { render, adapter } = createPickerRenderer({ clock: 'fake', adapterName: 'luxon' });

    it('should update the field when time zone changes (timestamp remains the same)', () => {
      const { setProps } = render(<DateTimeField />);
      const input = getTextbox();

      const date = adapter.date(new Date('2020-06-18T14:30:10.000Z')).setZone('UTC');
      setProps({ value: date });

      expectInputValue(input, '06/18/2020 02:30 PM');

      setProps({ value: date.setZone('America/Los_Angeles') });

      expectInputValue(input, '06/18/2020 07:30 AM');
    });
  });
});

import * as React from 'react';
import { expect } from 'chai';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { screen, act, userEvent } from '@mui/monorepo/test/utils';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers-utils';
import { DateFieldProps } from '@mui/x-date-pickers/DateField/DateField.interfaces';

describe('<DateField /> - Editing', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2022, 5, 15),
  });

  const testKeyPress = <TDate extends unknown>({
    key,
    expectedValue,
    cursorPosition = 1,
    ...props
  }: DateFieldProps<TDate> & { key: string; expectedValue: string; cursorPosition?: number }) => {
    render(<DateField {...props} />);
    const input = screen.getByRole('textbox');

    act(() => {
      input.focus();
      input.setSelectionRange(cursorPosition, cursorPosition);
      clock.runToLast();
    });

    userEvent.keyPress(input, { key });
    expect(input.value).to.equal(expectedValue);
  };

  describe('key: ArrowDown', () => {
    it("should set the year to today's value when no value is provided", () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        key: 'ArrowDown',
        expectedValue: '2022',
      });
    });

    it('should decrement the year when a value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        defaultValue: adapterToUse.date(),
        key: 'ArrowDown',
        expectedValue: '2021',
      });
    });

    it('should set the month to December when no value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.month,
        key: 'ArrowDown',
        expectedValue: 'December',
      });
    });

    it('should decrement the month when a value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.month,
        defaultValue: adapterToUse.date(),
        key: 'ArrowDown',
        expectedValue: 'May',
      });
    });

    it('should go to the last month of the previous year when a value in January is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.monthAndYear,
        defaultValue: adapterToUse.date(new Date(2022, 0, 15)),
        key: 'ArrowDown',
        expectedValue: 'December 2021',
      });
    });

    it("should set the day to the last day of today's month when no value is provided", () => {
      testKeyPress({
        format: adapterToUse.formats.dayOfMonth,
        key: 'ArrowDown',
        expectedValue: '30',
      });
    });

    it('should decrement the day when a value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.dayOfMonth,
        defaultValue: adapterToUse.date(),
        key: 'ArrowDown',
        expectedValue: '14',
      });
    });

    it('should go to the last day of the previous month when a value in the first day of the month is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.monthAndDate,
        defaultValue: adapterToUse.date(new Date(2022, 5, 1)),
        key: 'ArrowDown',
        expectedValue: 'May 31',
        // To select the date and not the month
        cursorPosition: 5,
      });
    });

    it('should not edit the value when props.readOnly = true and no value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        readOnly: true,
        key: 'ArrowDown',
        expectedValue: 'year',
      });
    });

    it('should not edit the value when props.readOnly = true and a value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        defaultValue: adapterToUse.date(),
        readOnly: true,
        key: 'ArrowDown',
        expectedValue: '2022',
      });
    });
  });

  describe('key: ArrowUp', () => {
    it("should set the year to today's value when no value is provided", () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        key: 'ArrowUp',
        expectedValue: '2022',
      });
    });

    it('should increment the year when a value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        defaultValue: adapterToUse.date(),
        key: 'ArrowUp',
        expectedValue: '2023',
      });
    });

    it('should set the month to January when no value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.month,
        key: 'ArrowUp',
        expectedValue: 'January',
      });
    });

    it('should increment the month when a value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.month,
        defaultValue: adapterToUse.date(),
        key: 'ArrowUp',
        expectedValue: 'July',
      });
    });

    it('should decrement go to the first month of the next year when when a value in December is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.monthAndYear,
        defaultValue: adapterToUse.date(new Date(2022, 11, 15)),
        key: 'ArrowUp',
        expectedValue: 'January 2023',
      });
    });

    it('should set the day 1 when no value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.dayOfMonth,
        key: 'ArrowUp',
        expectedValue: '1',
      });
    });

    it('should increment the day when a value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.dayOfMonth,
        defaultValue: adapterToUse.date(),
        key: 'ArrowUp',
        expectedValue: '16',
      });
    });

    it('should go to the first day of the next month when a value in the last day of the month is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.monthAndDate,
        defaultValue: adapterToUse.date(new Date(2022, 5, 30)),
        key: 'ArrowUp',
        expectedValue: 'July 1',
        // To select the date and not the month
        cursorPosition: 5,
      });
    });

    it('should not edit the value when props.readOnly = true and no value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        readOnly: true,
        key: 'ArrowUp',
        expectedValue: 'year',
      });
    });

    it('should not edit the value when props.readOnly = true and a value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        defaultValue: adapterToUse.date(),
        readOnly: true,
        key: 'ArrowUp',
        expectedValue: '2022',
      });
    });
  });

  describe('Digit editing', () => {
    it('should not edit when props.readOnly = true and no value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        readOnly: true,
        key: '1',
        expectedValue: 'year',
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        defaultValue: adapterToUse.date(),
        readOnly: true,
        key: '1',
        expectedValue: '2022',
      });
    });
  });

  describe('Letter editing', () => {
    it('should not edit when props.readOnly = true and no value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.month,
        readOnly: true,
        key: '1',
        expectedValue: 'month',
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.month,
        defaultValue: adapterToUse.date(),
        readOnly: true,
        key: 'd',
        expectedValue: 'June',
      });
    });
  });
});

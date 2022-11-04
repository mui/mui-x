import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { Unstable_TimeField as TimeField, TimeFieldProps } from '@mui/x-date-pickers/TimeField';
import { screen, act, userEvent, fireEvent } from '@mui/monorepo/test/utils';
import { createPickerRenderer, adapterToUse, expectInputValue } from 'test/utils/pickers-utils';

describe('<TimeField /> - Editing', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2022, 5, 15, 14, 25, 32),
  });

  const clickOnInput = (input: HTMLInputElement, cursorPosition: number) => {
    act(() => {
      input.focus();
      input.setSelectionRange(cursorPosition, cursorPosition);
      clock.runToLast();
    });
  };

  const testKeyPress = <TDate extends unknown>({
    key,
    expectedValue,
    cursorPosition = 1,
    valueToSelect,
    ...props
  }: TimeFieldProps<TDate> & {
    key: string;
    expectedValue: string;
    cursorPosition?: number;
    valueToSelect?: string;
  }) => {
    render(<TimeField {...props} />);
    const input = screen.getByRole('textbox');
    const clickPosition = valueToSelect ? input.value.indexOf(valueToSelect) : cursorPosition;
    if (clickPosition === -1) {
      throw new Error(
        `Failed to find value to select "${valueToSelect}" in input value: ${input.value}`,
      );
    }
    clickOnInput(input, clickPosition);
    userEvent.keyPress(input, { key });
    expectInputValue(input, expectedValue);
  };

  const testChange = <TDate extends unknown>({
    inputValue,
    expectedValue,
    cursorPosition = 1,
    ...props
  }: TimeFieldProps<TDate> & {
    inputValue: string;
    expectedValue: string;
    cursorPosition?: number;
  }) => {
    render(<TimeField {...props} />);
    const input = screen.getByRole('textbox');
    clickOnInput(input, cursorPosition);
    fireEvent.change(input, { target: { value: inputValue } });
    expectInputValue(input, expectedValue);
  };

  describe('key: ArrowDown', () => {
    describe('24 hours format', () => {
      it('should set the hour to 23 when no value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.hours24h,
          key: 'ArrowDown',
          expectedValue: '23',
        });
      });

      it('should decrement the hour when a value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.hours24h,
          defaultValue: adapterToUse.date(),
          key: 'ArrowDown',
          expectedValue: '13',
        });
      });

      it('should go to the last hour of the previous day when a value in the first hour is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime24h,
          defaultValue: adapterToUse.date(new Date(2022, 5, 15, 0, 12, 25)),
          key: 'ArrowDown',
          expectedValue: '23:12',
        });
      });

      it('should set the minutes to 59 when no value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.minutes,
          key: 'ArrowDown',
          expectedValue: '59',
        });
      });

      it('should decrement the minutes when a value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.minutes,
          defaultValue: adapterToUse.date(),
          key: 'ArrowDown',
          expectedValue: '24',
        });
      });

      it('should go to the last minute of the previous hour when a value with 0 minutes is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime24h,
          defaultValue: adapterToUse.date(new Date(2022, 5, 15, 14, 0, 32)),
          key: 'ArrowDown',
          expectedValue: '13:59',
          valueToSelect: '00',
        });
      });
    });

    describe('12 hours format', () => {
      it('should set the hour to 11 when no value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.hours12h,
          key: 'ArrowDown',
          expectedValue: '11',
        });
      });

      it('should go to the last hour of the previous day when a value in the first hour is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          defaultValue: adapterToUse.date(new Date(2022, 5, 15, 0, 12, 25)),
          key: 'ArrowDown',
          expectedValue: '11:12 pm',
        });
      });

      it('should set the meridiem to PM when no value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          key: 'ArrowDown',
          expectedValue: 'hh:mm pm',
          valueToSelect: 'aa',
        });
      });

      it('should set the meridiem to PM when a value in AM is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          defaultValue: new Date(2022, 5, 15, 2, 25, 32),
          key: 'ArrowDown',
          expectedValue: '02:25 pm',
          valueToSelect: 'am',
        });
      });

      it('should set the meridiem to AM when a value in PM is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          defaultValue: new Date(2022, 5, 15, 14, 25, 32),
          key: 'ArrowDown',
          expectedValue: '02:25 am',
          valueToSelect: 'pm',
        });
      });

      it('should go from AM to PM when the current value is 00:00 AM', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          defaultValue: adapterToUse.date(new Date(2022, 5, 15, 0, 0, 32)),
          key: 'ArrowDown',
          expectedValue: '11:59 pm',
          cursorPosition: 6,
        });
      });

      it('should go from PM to AM when the current value is 00:00 PM', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          defaultValue: adapterToUse.date(new Date(2022, 5, 15, 12, 0, 32)),
          key: 'ArrowDown',
          expectedValue: '11:59 am',
          cursorPosition: 6,
        });
      });
    });
  });

  describe('key: ArrowUp', () => {
    describe('24 hours format', () => {
      it('should set the hour to 0 when no value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.hours24h,
          key: 'ArrowUp',
          expectedValue: '00',
        });
      });

      it('should increment the hour when a value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.hours24h,
          defaultValue: adapterToUse.date(),
          key: 'ArrowUp',
          expectedValue: '15',
        });
      });

      it('should go to the first hour of the next day when a value in the last hour is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime24h,
          defaultValue: adapterToUse.date(new Date(2022, 5, 15, 23, 12, 25)),
          key: 'ArrowUp',
          expectedValue: '00:12',
        });
      });

      it('should set the minutes to 00 when no value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.minutes,
          key: 'ArrowUp',
          expectedValue: '00',
        });
      });

      it('should increment the minutes when a value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.minutes,
          defaultValue: adapterToUse.date(),
          key: 'ArrowUp',
          expectedValue: '26',
        });
      });

      it('should go to the first minute of the next hour when a value with 59 minutes is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime24h,
          defaultValue: adapterToUse.date(new Date(2022, 5, 15, 14, 59, 32)),
          key: 'ArrowUp',
          expectedValue: '15:00',
          valueToSelect: '59',
        });
      });
    });

    describe('12 hours format', () => {
      it('should set the meridiem to AM when no value is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          key: 'ArrowUp',
          expectedValue: 'hh:mm am',
          cursorPosition: 14,
        });
      });

      it('should set the meridiem to PM when a value in AM is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          defaultValue: new Date(2022, 5, 15, 2, 25, 32),
          key: 'ArrowUp',
          expectedValue: '02:25 pm',
          cursorPosition: 14,
        });
      });

      it('should set the meridiem to AM when a value in PM is provided', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          defaultValue: new Date(2022, 5, 15, 14, 25, 32),
          key: 'ArrowUp',
          expectedValue: '02:25 am',
          cursorPosition: 14,
        });
      });

      it('should go from AM to PM when the current value is 11:59 AM', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          defaultValue: adapterToUse.date(new Date(2022, 5, 15, 11, 59, 32)),
          key: 'ArrowUp',
          expectedValue: '12:00 pm',
          valueToSelect: '59',
        });
      });

      it('should go from PM to AM when the current value is 11:59 PM', () => {
        testKeyPress({
          format: adapterToUse.formats.fullTime12h,
          defaultValue: adapterToUse.date(new Date(2022, 5, 15, 23, 59, 32)),
          key: 'ArrowUp',
          expectedValue: '12:00 am',
          valueToSelect: '59',
        });
      });
    });
  });

  describe('Digit editing', () => {
    it('should set the day to the digit pressed when no digit no value is provided', () => {
      testChange({
        format: adapterToUse.formats.minutes,
        inputValue: '1',
        expectedValue: '01',
      });
    });

    it('should concatenate the digit pressed to the current section value if the output is valid', () => {
      testChange({
        format: adapterToUse.formats.minutes,
        defaultValue: adapterToUse.date(new Date(2022, 5, 15, 14, 3, 32)),
        inputValue: '1',
        expectedValue: '31',
      });
    });

    it('should set the day to the digit pressed if the concatenate exceeds the maximum value for the section', () => {
      testChange({
        format: adapterToUse.formats.minutes,
        defaultValue: adapterToUse.date(new Date(2022, 5, 15, 14, 8, 32)),
        inputValue: '1',
        expectedValue: '01',
      });
    });

    it('should not edit when props.readOnly = true and no value is provided', () => {
      testChange({
        format: adapterToUse.formats.minutes,
        readOnly: true,
        inputValue: '1',
        expectedValue: 'mm',
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided', () => {
      testChange({
        format: adapterToUse.formats.minutes,
        defaultValue: adapterToUse.date(),
        readOnly: true,
        inputValue: '1',
        expectedValue: '25',
      });
    });
  });

  describe('Letter editing', () => {
    it('should not edit when props.readOnly = true and no value is provided', () => {
      testChange({
        format: adapterToUse.formats.fullTime12h,
        readOnly: true,
        inputValue: 'hh:mm a', // Press "a"
        expectedValue: 'hh:mm aa',
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided', () => {
      testChange({
        format: adapterToUse.formats.fullTime12h,
        defaultValue: adapterToUse.date(),
        readOnly: true,
        inputValue: '02:25 a',
        expectedValue: '02:25 pm',
      });
    });

    it('should set meridiem to AM when pressing "a" and no value is provided', () => {
      testChange({
        format: adapterToUse.formats.fullTime12h,
        cursorPosition: 17,
        inputValue: 'hh:mm a', // Press "a"
        expectedValue: 'hh:mm am',
      });
    });

    it('should set meridiem to PM when pressing "p" and no value is provided', () => {
      testChange({
        format: adapterToUse.formats.fullTime12h,
        cursorPosition: 17,
        inputValue: 'hh:mm p', // Press "p"
        expectedValue: 'hh:mm pm',
      });
    });

    it('should set meridiem to AM when pressing "a" and a value is provided', () => {
      testChange({
        format: adapterToUse.formats.fullTime12h,
        defaultValue: adapterToUse.date(),
        cursorPosition: 17,
        inputValue: '02:25 a', // Press "a"
        expectedValue: '02:25 am',
      });
    });

    it('should set meridiem to PM when pressing "p" and a value is provided', () => {
      testChange({
        format: adapterToUse.formats.fullTime12h,
        defaultValue: adapterToUse.date(new Date(2022, 5, 15, 2, 25, 32)),
        cursorPosition: 17,
        inputValue: '02:25 p', // Press "p"
        expectedValue: '02:25 pm',
      });
    });
  });

  describe('Do not loose missing section values ', () => {
    it('should not loose date information when a value is provided', () => {
      const onChange = spy();

      render(
        <TimeField
          defaultValue={adapterToUse.date(new Date(2010, 3, 3, 3, 3, 3))}
          onChange={onChange}
        />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);
      userEvent.keyPress(input, { key: 'ArrowDown' });

      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));
    });

    it('should not loose time information when cleaning the date then filling it again', () => {
      const onChange = spy();

      render(
        <TimeField
          defaultValue={adapterToUse.date(new Date(2010, 3, 3, 3, 3, 3))}
          format={adapterToUse.formats.fullTime24h}
          onChange={onChange}
        />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      userEvent.keyPress(input, { key: 'Backspace' });

      fireEvent.change(input, { target: { value: '3:mm' } }); // Press "3"
      expectInputValue(input, '03:mm');

      userEvent.keyPress(input, { key: 'ArrowRight' });
      fireEvent.change(input, { target: { value: '03:4' } }); // Press "3"
      expectInputValue(input, '03:04');

      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 3, 4, 3));
    });

    it('should not loose time information when using the hour format and value is provided', () => {
      const onChange = spy();

      render(
        <TimeField
          format={adapterToUse.formats.hours24h}
          defaultValue={adapterToUse.date(new Date(2010, 3, 3, 3, 3, 3))}
          onChange={onChange}
        />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);
      userEvent.keyPress(input, { key: 'ArrowDown' });

      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));
    });
  });
});

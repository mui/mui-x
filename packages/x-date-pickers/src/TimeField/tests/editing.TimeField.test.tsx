import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { screen, userEvent, fireEvent } from '@mui/monorepo/test/utils';
import {
  expectInputValue,
  getCleanedSelectedContent,
} from 'test/utils/pickers-utils';
import { describeAdapters } from '@mui/x-date-pickers/tests/describeAdapters';

describe('<TimeField /> - Editing', () => {
  describeAdapters.only('key: ArrowDown', TimeField, ({ adapter, testFieldKeyPress }) => {
    describe('24 hours format (ArrowDown)', () => {
      it('should set the hour to 23 when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.hours24h,
          key: 'ArrowDown',
          expectedValue: '23',
        });
      });

      it('should decrement the hour when a value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.hours24h,
          defaultValue: adapter.date(),
          key: 'ArrowDown',
          expectedValue: '13',
        });
      });

      it('should go to the last hour of the previous day when a value in the first hour is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime24h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 0, 12, 25)),
          key: 'ArrowDown',
          expectedValue: '23:12',
        });
      });

      it('should set the minutes to 59 when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.minutes,
          key: 'ArrowDown',
          expectedValue: '59',
        });
      });

      it('should decrement the minutes when a value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.minutes,
          defaultValue: adapter.date(),
          key: 'ArrowDown',
          expectedValue: '24',
        });
      });

      it('should go to the last minute of the previous hour when a value with 0 minutes is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime24h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 14, 0, 32)),
          key: 'ArrowDown',
          expectedValue: '13:59',
          valueToSelect: '00',
        });
      });
    });

    describe('12 hours format (ArrowDown)', () => {
      it('should set the hour to 11 when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.hours12h,
          key: 'ArrowDown',
          expectedValue: '11',
        });
      });

      it('should go to the last hour of the previous day when a value in the first hour is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 0, 12, 25)),
          key: 'ArrowDown',
          expectedValue: '11:12 pm',
        });
      });

      it('should set the meridiem to PM when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          key: 'ArrowDown',
          expectedValue: 'hh:mm pm',
          valueToSelect: 'aa',
        });
      });

      it('should set the meridiem to PM when a value in AM is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: new Date(2022, 5, 15, 2, 25, 32),
          key: 'ArrowDown',
          expectedValue: '02:25 pm',
          valueToSelect: 'am',
        });
      });

      it('should set the meridiem to AM when a value in PM is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: new Date(2022, 5, 15, 14, 25, 32),
          key: 'ArrowDown',
          expectedValue: '02:25 am',
          valueToSelect: 'pm',
        });
      });

      it('should go from AM to PM when the current value is 00:00 AM', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 0, 0, 32)),
          key: 'ArrowDown',
          expectedValue: '11:59 pm',
          valueToSelect: '00',
        });
      });

      it('should go from PM to AM when the current value is 00:00 PM', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 12, 0, 32)),
          key: 'ArrowDown',
          expectedValue: '11:59 am',
          valueToSelect: '00',
        });
      });
    });
  });

  describeAdapters('key: ArrowUp', ({ adapter, testFieldKeyPress}) => {
    describe('24 hours format (ArrowUp)', () => {
      it('should set the hour to 0 when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.hours24h,
          key: 'ArrowUp',
          expectedValue: '00',
        });
      });

      it('should increment the hour when a value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.hours24h,
          defaultValue: adapter.date(),
          key: 'ArrowUp',
          expectedValue: '15',
        });
      });

      it('should go to the first hour of the next day when a value in the last hour is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime24h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 23, 12, 25)),
          key: 'ArrowUp',
          expectedValue: '00:12',
        });
      });

      it('should set the minutes to 00 when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.minutes,
          key: 'ArrowUp',
          expectedValue: '00',
        });
      });

      it('should increment the minutes when a value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.minutes,
          defaultValue: adapter.date(),
          key: 'ArrowUp',
          expectedValue: '26',
        });
      });

      it('should go to the first minute of the next hour when a value with 59 minutes is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime24h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 14, 59, 32)),
          key: 'ArrowUp',
          expectedValue: '15:00',
          valueToSelect: '59',
        });
      });
    });

    describe('12 hours format (ArrowUp)', () => {
      it('should set the meridiem to AM when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          key: 'ArrowUp',
          expectedValue: 'hh:mm am',
          cursorPosition: 14,
        });
      });

      it('should set the meridiem to PM when a value in AM is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: new Date(2022, 5, 15, 2, 25, 32),
          key: 'ArrowUp',
          expectedValue: '02:25 pm',
          cursorPosition: 14,
        });
      });

      it('should set the meridiem to AM when a value in PM is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: new Date(2022, 5, 15, 14, 25, 32),
          key: 'ArrowUp',
          expectedValue: '02:25 am',
          cursorPosition: 14,
        });
      });

      it('should go from AM to PM when the current value is 11:59 AM', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 11, 59, 32)),
          key: 'ArrowUp',
          expectedValue: '12:00 pm',
          valueToSelect: '59',
        });
      });

      it('should go from PM to AM when the current value is 11:59 PM', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 23, 59, 32)),
          key: 'ArrowUp',
          expectedValue: '12:00 am',
          valueToSelect: '59',
        });
      });
    });
  });

  describe('Digit editing', () => {
    it('should set the minute to the digit pressed when no digit no value is provided', () => {
      testChange({
        format: adapter.formats.minutes,
        keyStrokes: [{ value: '1', expected: '01' }],
      });
    });

    it('should concatenate the digit pressed to the current section value if the output is valid', () => {
      testChange({
        format: adapter.formats.minutes,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 3, 32)),
        keyStrokes: [
          { value: '1', expected: '01' },
          { value: '2', expected: '12' },
        ],
      });
    });

    it('should set the minute to the digit pressed if the concatenate exceeds the maximum value for the section', () => {
      testChange({
        format: adapter.formats.minutes,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 3, 32)),
        keyStrokes: [
          { value: '7', expected: '07' },
          { value: '2', expected: '02' },
        ],
      });
    });

    it('should not edit when props.readOnly = true and no value is provided', () => {
      testChange({
        format: adapter.formats.minutes,
        readOnly: true,
        keyStrokes: [{ value: '1', expected: 'mm' }],
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided', () => {
      testChange({
        format: adapter.formats.minutes,
        defaultValue: adapter.date(),
        readOnly: true,
        keyStrokes: [{ value: '1', expected: '25' }],
      });
    });

    it('should go to the next section when pressing `2` in a 12-hours format', () => {
      render(<TimeField format={adapter.formats.fullTime12h} />);

      const input = screen.getByRole('textbox');
      clickOnInput(input, 0);

      // Press "2"
      fireEvent.change(input, { target: { value: '2:mm aa' } });
      expectInputValue(input, '02:mm aa');
      expect(getCleanedSelectedContent(input)).to.equal('mm');
    });

    it('should go to the next section when pressing `1` then `3` in a 12-hours format', () => {
      render(<TimeField format={adapter.formats.fullTime12h} />);

      const input = screen.getByRole('textbox');
      clickOnInput(input, 0);

      // Press "1"
      fireEvent.change(input, { target: { value: '1:mm aa' } });
      expectInputValue(input, '01:mm aa');
      expect(getCleanedSelectedContent(input)).to.equal('01');

      // Press "3"
      fireEvent.change(input, { target: { value: '3:mm aa' } });
      expectInputValue(input, '03:mm aa');
      expect(getCleanedSelectedContent(input)).to.equal('mm');
    });
  });

  describe('Letter editing', () => {
    it('should not edit when props.readOnly = true and no value is provided', () => {
      testChange({
        format: adapter.formats.fullTime12h,
        readOnly: true,
        // Press "a"
        keyStrokes: [{ value: 'hh:mm a', expected: 'hh:mm aa' }],
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided', () => {
      testChange({
        format: adapter.formats.fullTime12h,
        defaultValue: adapter.date(),
        readOnly: true,
        // Press "a"
        keyStrokes: [{ value: '02:25 a', expected: '02:25 pm' }],
      });
    });

    it('should set meridiem to AM when pressing "a" and no value is provided', () => {
      testChange({
        format: adapter.formats.fullTime12h,
        cursorPosition: 17,
        // Press "a"
        keyStrokes: [{ value: 'hh:mm a', expected: 'hh:mm am' }],
      });
    });

    it('should set meridiem to PM when pressing "p" and no value is provided', () => {
      testChange({
        format: adapter.formats.fullTime12h,
        cursorPosition: 17,
        // Press "p"
        keyStrokes: [{ value: 'hh:mm p', expected: 'hh:mm pm' }],
      });
    });

    it('should set meridiem to AM when pressing "a" and a value is provided', () => {
      testChange({
        format: adapter.formats.fullTime12h,
        defaultValue: adapter.date(),
        cursorPosition: 17,
        // Press "a"
        keyStrokes: [{ value: '02:25 a', expected: '02:25 am' }],
      });
    });

    it('should set meridiem to PM when pressing "p" and a value is provided', () => {
      testChange({
        format: adapter.formats.fullTime12h,
        defaultValue: adapter.date(new Date(2022, 5, 15, 2, 25, 32)),
        cursorPosition: 17,
        // Press "p"
        keyStrokes: [{ value: '02:25 p', expected: '02:25 pm' }],
      });
    });
  });

  describe('Do not loose missing section values ', () => {
    it('should not loose date information when a value is provided', () => {
      const onChange = spy();

      render(
        <TimeField
          defaultValue={adapter.date(new Date(2010, 3, 3, 3, 3, 3))}
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
          defaultValue={adapter.date(new Date(2010, 3, 3, 3, 3, 3))}
          format={adapter.formats.fullTime24h}
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
          format={adapter.formats.hours24h}
          defaultValue={adapter.date(new Date(2010, 3, 3, 3, 3, 3))}
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

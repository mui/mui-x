import { expect } from 'chai';
import { spy } from 'sinon';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { userEvent, fireEvent } from '@mui/monorepo/test/utils';
import { expectInputValue, getCleanedSelectedContent } from 'test/utils/pickers';
import { describeAdapters } from '@mui/x-date-pickers/tests/describeAdapters';

describe('<TimeField /> - Editing', () => {
  describeAdapters('key: ArrowDown', TimeField, ({ adapter, testFieldKeyPress }) => {
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
          defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
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
          defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
          key: 'ArrowDown',
          expectedValue: '11',
        });
      });

      it('should go to the last minute of the current hour when a value with 0 minutes is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime24h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 14, 0, 25)),
          key: 'ArrowDown',
          expectedValue: '14:59',
          selectedSection: 'minutes',
        });
      });
    });

    describe('12 hours format (ArrowDown)', () => {
      it('should set the hour to 11 when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.hours12h,
          key: 'ArrowDown',
          expectedValue: '12',
        });
      });

      it('should go to the last hour of the current morning when a value in the first hour is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 0, 12, 25)),
          key: 'ArrowDown',
          expectedValue: '11:12 AM',
        });
      });

      it('should set the meridiem to PM when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          key: 'ArrowDown',
          expectedValue: 'hh:mm PM',
          selectedSection: 'meridiem',
        });
      });

      it('should set the meridiem to PM when a value in AM is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 2, 12, 25)),
          key: 'ArrowDown',
          expectedValue: '02:12 PM',
          selectedSection: 'meridiem',
        });
      });

      it('should set the meridiem to AM when a value in PM is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
          key: 'ArrowDown',
          expectedValue: '02:12 AM',
          selectedSection: 'meridiem',
        });
      });
    });
  });

  describeAdapters('key: ArrowUp', TimeField, ({ adapter, testFieldKeyPress }) => {
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
          defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
          key: 'ArrowUp',
          expectedValue: '15',
        });
      });

      it('should go to the first hour of the current day when a value in the last hour is provided', () => {
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
          defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
          key: 'ArrowUp',
          expectedValue: '13',
        });
      });

      it('should go to the first minute of the current hour when a value with 59 minutes is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime24h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 14, 59, 25)),
          key: 'ArrowUp',
          expectedValue: '14:00',
          selectedSection: 'minutes',
        });
      });
    });

    describe('12 hours format (ArrowUp)', () => {
      it('should set the meridiem to AM when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          key: 'ArrowUp',
          expectedValue: 'hh:mm AM',
          selectedSection: 'meridiem',
        });
      });

      it('should set the meridiem to PM when a value in AM is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 2, 12, 25)),
          key: 'ArrowUp',
          expectedValue: '02:12 PM',
          selectedSection: 'meridiem',
        });
      });

      it('should set the meridiem to AM when a value in PM is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
          key: 'ArrowUp',
          expectedValue: '02:12 AM',
          selectedSection: 'meridiem',
        });
      });
    });
  });

  describeAdapters('Digit editing', TimeField, ({ adapter, renderWithProps, testFieldChange }) => {
    it('should set the minute to the digit pressed when no digit no value is provided', () => {
      testFieldChange({
        format: adapter.formats.minutes,
        keyStrokes: [{ value: '1', expected: '01' }],
      });
    });

    it('should concatenate the digit pressed to the current section value if the output is valid', () => {
      testFieldChange({
        format: adapter.formats.minutes,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
        keyStrokes: [
          { value: '1', expected: '01' },
          { value: '2', expected: '12' },
        ],
      });
    });

    it('should set the minute to the digit pressed if the concatenate exceeds the maximum value for the section', () => {
      testFieldChange({
        format: adapter.formats.minutes,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
        keyStrokes: [
          { value: '7', expected: '07' },
          { value: '2', expected: '02' },
        ],
      });
    });

    it('should not edit when props.readOnly = true and no value is provided (digit)', () => {
      testFieldChange({
        format: adapter.formats.minutes,
        readOnly: true,
        keyStrokes: [{ value: '1', expected: 'mm' }],
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided (digit)', () => {
      testFieldChange({
        format: adapter.formats.minutes,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
        readOnly: true,
        keyStrokes: [{ value: '1', expected: '12' }],
      });
    });

    it('should go to the next section when pressing `2` in a 12-hours format', () => {
      const { input, selectSection } = renderWithProps({ format: adapter.formats.fullTime12h });

      selectSection('hours');

      // Press "2"
      fireEvent.change(input, { target: { value: '2:mm aa' } });
      expectInputValue(input, '02:mm aa');
      expect(getCleanedSelectedContent(input)).to.equal('mm');
    });

    it('should go to the next section when pressing `1` then `3` in a 12-hours format', () => {
      const { input, selectSection } = renderWithProps({ format: adapter.formats.fullTime12h });

      selectSection('hours');

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

  describeAdapters('Letter editing', TimeField, ({ adapter, testFieldChange }) => {
    it('should not edit when props.readOnly = true and no value is provided (letter)', () => {
      testFieldChange({
        format: adapter.formats.fullTime12h,
        readOnly: true,
        // Press "a"
        keyStrokes: [{ value: 'hh:mm a', expected: 'hh:mm aa' }],
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided (letter)', () => {
      testFieldChange({
        format: adapter.formats.fullTime12h,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
        readOnly: true,
        // Press "a"
        keyStrokes: [{ value: '02:12 a', expected: '02:12 PM' }],
      });
    });

    it('should set meridiem to AM when pressing "a" and no value is provided', () => {
      testFieldChange({
        format: adapter.formats.fullTime12h,
        selectedSection: 'meridiem',
        // Press "a"
        keyStrokes: [{ value: 'hh:mm a', expected: 'hh:mm AM' }],
      });
    });

    it('should set meridiem to PM when pressing "p" and no value is provided', () => {
      testFieldChange({
        format: adapter.formats.fullTime12h,
        selectedSection: 'meridiem',
        // Press "p"
        keyStrokes: [{ value: 'hh:mm p', expected: 'hh:mm PM' }],
      });
    });

    it('should set meridiem to AM when pressing "a" and a value is provided', () => {
      testFieldChange({
        format: adapter.formats.fullTime12h,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
        selectedSection: 'meridiem',
        // Press "a"
        keyStrokes: [{ value: '02:12 a', expected: '02:12 AM' }],
      });
    });

    it('should set meridiem to PM when pressing "p" and a value is provided', () => {
      testFieldChange({
        format: adapter.formats.fullTime12h,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 12, 25)),
        selectedSection: 'meridiem',
        // Press "p"
        keyStrokes: [{ value: '02:12 p', expected: '02:12 PM' }],
      });
    });
  });

  describeAdapters(
    'Do not loose missing section values ',
    TimeField,
    ({ adapter, renderWithProps }) => {
      it('should not loose date information when a value is provided', () => {
        const onChange = spy();

        const { input, selectSection } = renderWithProps({
          defaultValue: adapter.date(new Date(2010, 3, 3, 3, 3, 3)),
          onChange,
        });

        selectSection('hours');
        userEvent.keyPress(input, { key: 'ArrowDown' });

        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));
      });

      it('should not loose date information when cleaning the date then filling it again', () => {
        if (adapter.lib !== 'dayjs') {
          return;
        }

        const onChange = spy();

        const { input, selectSection } = renderWithProps({
          defaultValue: adapter.date(new Date(2010, 3, 3, 3, 3, 3)),
          onChange,
          format: adapter.formats.fullTime24h,
        });

        selectSection('hours');
        userEvent.keyPress(input, { key: 'a', ctrlKey: true });
        userEvent.keyPress(input, { key: 'Backspace' });
        userEvent.keyPress(input, { key: 'ArrowLeft' });

        fireEvent.change(input, { target: { value: '3:mm' } }); // Press "3"
        expectInputValue(input, '03:mm');

        userEvent.keyPress(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: '03:4' } }); // Press "3"
        expectInputValue(input, '03:04');
        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 3, 4, 3));
      });

      it('should not loose time information when using the hour format and value is provided', () => {
        const onChange = spy();

        const { input, selectSection } = renderWithProps({
          defaultValue: adapter.date(new Date(2010, 3, 3, 3, 3, 3)),
          onChange,
          format: adapter.formats.hours24h,
        });

        selectSection('hours');
        userEvent.keyPress(input, { key: 'ArrowDown' });

        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));
      });
    },
  );

  describeAdapters('props: minutesStep', TimeField, ({ adapter, testFieldKeyPress }) => {
    it('should use `minitesStep` to set initial minutes with ArrowUp', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        key: 'ArrowUp',
        minutesStep: 5,
        expectedValue: '00',
      });
    });

    it('should use `minitesStep` to set initial minutes with ArrowDown', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        key: 'ArrowDown',
        minutesStep: 5,
        expectedValue: '00',
      });
    });

    it('should use `minitesStep` to increase minutes', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 0, 25)),
        key: 'ArrowUp',
        minutesStep: 5,
        expectedValue: '05',
      });
    });

    it('should use `minitesStep` to decrease minutes', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 0, 25)),
        key: 'ArrowDown',
        minutesStep: 5,
        expectedValue: '55',
      });
    });

    it('should go to the closest valid values acording to `minitesStep` when pressing ArrowDown', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 2, 25)),
        key: 'ArrowDown',
        minutesStep: 5,
        expectedValue: '00',
      });
    });

    it('should go to the closest valid values acording to `minitesStep` when pressing ArrowUp', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        defaultValue: adapter.date(new Date(2022, 5, 15, 14, 2, 25)),
        key: 'ArrowUp',
        minutesStep: 5,
        expectedValue: '05',
      });
    });
  });
});

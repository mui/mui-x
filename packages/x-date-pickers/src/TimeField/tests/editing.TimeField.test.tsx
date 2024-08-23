import { expect } from 'chai';
import { spy } from 'sinon';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { fireEvent } from '@mui/internal-test-utils';
import {
  expectFieldValueV7,
  expectFieldValueV6,
  getCleanedSelectedContent,
  describeAdapters,
  getTextbox,
} from 'test/utils/pickers';

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
          defaultValue: adapter.date('2022-06-15T14:12:25'),
          key: 'ArrowDown',
          expectedValue: '13',
        });
      });

      it('should go to the last hour of the previous day when a value in the first hour is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime24h,
          defaultValue: adapter.date('2022-06-15T00:12:25'),
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
          defaultValue: adapter.date('2022-06-15T14:12:25'),
          key: 'ArrowDown',
          expectedValue: '11',
        });
      });

      it('should go to the last minute of the current hour when a value with 0 minutes is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime24h,
          defaultValue: adapter.date('2022-06-15T14:00:25'),
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
          defaultValue: adapter.date('2022-06-15T00:12:25'),
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
          defaultValue: adapter.date('2022-06-15T02:12:25'),
          key: 'ArrowDown',
          expectedValue: '02:12 PM',
          selectedSection: 'meridiem',
        });
      });

      it('should set the meridiem to AM when a value in PM is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date('2022-06-15T14:12:25'),
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
          defaultValue: adapter.date('2022-06-15T14:12:25'),
          key: 'ArrowUp',
          expectedValue: '15',
        });
      });

      it('should go to the first hour of the current day when a value in the last hour is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime24h,
          defaultValue: adapter.date('2022-06-15T23:12:25'),
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
          defaultValue: adapter.date('2022-06-15T14:12:25'),
          key: 'ArrowUp',
          expectedValue: '13',
        });
      });

      it('should go to the first minute of the current hour when a value with 59 minutes is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime24h,
          defaultValue: adapter.date('2022-06-15T14:59:25'),
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
          defaultValue: adapter.date('2022-06-15T02:12:25'),
          key: 'ArrowUp',
          expectedValue: '02:12 PM',
          selectedSection: 'meridiem',
        });
      });

      it('should set the meridiem to AM when a value in PM is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.fullTime12h,
          defaultValue: adapter.date('2022-06-15T14:12:25'),
          key: 'ArrowUp',
          expectedValue: '02:12 AM',
          selectedSection: 'meridiem',
        });
      });
    });
  });

  describeAdapters('key: PageDown', TimeField, ({ adapter, testFieldKeyPress }) => {
    describe('24 hours format (PageDown)', () => {
      describe('Hours field', () => {
        it('should set hours field to maximal when no default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.hours24h,
            key: 'PageDown',
            expectedValue: '23',
            selectedSection: 'hours',
          });
        });

        it('should decrement hours field by 5 when default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.hours24h,
            key: 'PageDown',
            defaultValue: adapter.date('2024-06-04T10:25:00'),
            expectedValue: '05',
            selectedSection: 'hours',
          });
        });

        it('should flip hours field when default value is lower than 5', () => {
          testFieldKeyPress({
            format: adapter.formats.hours24h,
            key: 'PageDown',
            defaultValue: adapter.date('2024-06-04T02:25:00'),
            expectedValue: '21',
            selectedSection: 'hours',
          });
        });
      });

      describe('Minutes field', () => {
        it('should set minutes field to maximal when no default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.minutes,
            key: 'PageDown',
            expectedValue: '59',
          });
        });

        it('should decrement minutes field by 5 when default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.minutes,
            key: 'PageDown',
            defaultValue: adapter.date('2024-06-04T10:59:00'),
            expectedValue: '54',
          });
        });

        it('should flip minutes field when default value is lower than 5', () => {
          testFieldKeyPress({
            format: adapter.formats.minutes,
            key: 'PageDown',
            defaultValue: adapter.date('2024-06-04T02:02:00'),
            expectedValue: '57',
          });
        });
      });
    });

    describe('12 hours format (PageDown)', () => {
      describe('Hours field', () => {
        it('should set hours field to maximal when no default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.hours12h,
            key: 'PageDown',
            expectedValue: '12',
          });
        });

        it('should decrement hours field by 5 when default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.hours12h,
            key: 'PageDown',
            defaultValue: adapter.date('2024-06-04T10:25:00'),
            expectedValue: '05',
          });
        });

        it('should flip hours field when default value is lower than 5', () => {
          testFieldKeyPress({
            format: adapter.formats.hours12h,
            key: 'PageDown',
            defaultValue: adapter.date('2024-06-04T02:25:00'),
            expectedValue: '09',
          });
        });
      });

      describe('Meridiem field', () => {
        it('should set meridiem to PM when no default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.meridiem,
            key: 'PageDown',
            expectedValue: 'PM',
            selectedSection: 'meridiem',
          });
        });

        it('should switch between AM and PM when meridiem value is not empty', () => {
          testFieldKeyPress({
            format: adapter.formats.meridiem,
            defaultValue: adapter.date('2024-05-30T02:12:25'),
            key: 'PageDown',
            expectedValue: 'PM',
            selectedSection: 'meridiem',
          });
          testFieldKeyPress({
            format: adapter.formats.meridiem,
            defaultValue: adapter.date('2024-05-30T20:12:25'),
            key: 'PageDown',
            expectedValue: 'AM',
            selectedSection: 'meridiem',
          });
        });
      });
    });
  });

  describeAdapters('key: PageUp', TimeField, ({ adapter, testFieldKeyPress }) => {
    describe('24 hours format (PageUp)', () => {
      describe('Hours field', () => {
        it('should set hours field to minimal when no default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.hours24h,
            key: 'PageUp',
            expectedValue: '00',
            selectedSection: 'hours',
          });
        });

        it('should increment hours field by 5 when default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.hours24h,
            key: 'PageUp',
            defaultValue: adapter.date('2024-06-04T10:25:00'),
            expectedValue: '15',
            selectedSection: 'hours',
          });
        });

        it('should flip hours field when default value is higher than 19', () => {
          testFieldKeyPress({
            format: adapter.formats.hours24h,
            key: 'PageUp',
            defaultValue: adapter.date('2024-06-04T21:25:00'),
            expectedValue: '02',
            selectedSection: 'hours',
          });
        });
      });

      describe('Minutes field', () => {
        it('should set minutes field to minimal when no default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.hours24h,
            key: 'PageUp',
            expectedValue: '00',
          });
        });

        it('should increment minutes field by 5 when default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.minutes,
            key: 'PageUp',
            defaultValue: adapter.date('2024-06-04T10:25:00'),
            expectedValue: '30',
          });
        });

        it('should flip minutes field when default value is higher than 55', () => {
          testFieldKeyPress({
            format: adapter.formats.minutes,
            key: 'PageUp',
            defaultValue: adapter.date('2024-06-04T21:56:00'),
            expectedValue: '01',
          });
        });
      });
    });
    describe('12 hours format (PageUp)', () => {
      describe('Hours field', () => {
        it('should set hours field to minimal when no default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.hours12h,
            key: 'PageUp',
            expectedValue: '01',
            selectedSection: 'hours',
          });
        });

        it('should increment hours field by 5 when default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.hours12h,
            key: 'PageUp',
            defaultValue: adapter.date('2024-06-04T05:25:00'),
            expectedValue: '10',
            selectedSection: 'hours',
          });
        });

        it('should flip hours field when default value is higher than 07', () => {
          testFieldKeyPress({
            format: adapter.formats.hours12h,
            key: 'PageUp',
            defaultValue: adapter.date('2024-06-04T08:25:00'),
            expectedValue: '01',
            selectedSection: 'hours',
          });
        });
      });

      describe('Meridiem field', () => {
        it('should set meridiem to AM when no default value is provided', () => {
          testFieldKeyPress({
            format: adapter.formats.meridiem,
            key: 'PageUp',
            expectedValue: 'AM',
            selectedSection: 'meridiem',
          });
        });

        it('should switch between AM and PM when meridiem value is not empty', () => {
          testFieldKeyPress({
            format: adapter.formats.meridiem,
            defaultValue: adapter.date('2024-05-30T02:12:25'),
            key: 'PageUp',
            expectedValue: 'PM',
            selectedSection: 'meridiem',
          });
          testFieldKeyPress({
            format: adapter.formats.meridiem,
            defaultValue: adapter.date('2024-05-30T20:12:25'),
            key: 'PageUp',
            expectedValue: 'AM',
            selectedSection: 'meridiem',
          });
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
        defaultValue: adapter.date('2022-06-15T14:12:25'),
        keyStrokes: [
          { value: '1', expected: '01' },
          { value: '2', expected: '12' },
        ],
      });
    });

    it('should set the minute to the digit pressed if the concatenate exceeds the maximum value for the section', () => {
      testFieldChange({
        format: adapter.formats.minutes,
        defaultValue: adapter.date('2022-06-15T14:12:25'),
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
        defaultValue: adapter.date('2022-06-15T14:12:25'),
        readOnly: true,
        keyStrokes: [{ value: '1', expected: '12' }],
      });
    });

    it('should go to the next section when pressing `2` in a 12-hours format', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: adapter.formats.fullTime12h,
      });

      view.selectSection('hours');

      view.pressKey(0, '2');
      expectFieldValueV7(view.getSectionsContainer(), '02:mm aa');
      expect(getCleanedSelectedContent()).to.equal('mm');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: adapter.formats.fullTime12h,
      });

      const input = getTextbox();
      view.selectSection('hours');

      // Press "2"
      fireEvent.change(input, { target: { value: '2:mm aa' } });
      expectFieldValueV6(input, '02:mm aa');
      expect(getCleanedSelectedContent()).to.equal('mm');
    });

    it('should go to the next section when pressing `1` then `3` in a 12-hours format', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: adapter.formats.fullTime12h,
      });

      view.selectSection('hours');

      view.pressKey(0, '1');
      expectFieldValueV7(view.getSectionsContainer(), '01:mm aa');
      expect(getCleanedSelectedContent()).to.equal('01');

      // Press "3"
      view.pressKey(0, '3');
      expectFieldValueV7(view.getSectionsContainer(), '03:mm aa');
      expect(getCleanedSelectedContent()).to.equal('mm');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: adapter.formats.fullTime12h,
      });

      const input = getTextbox();
      view.selectSection('hours');

      // Press "1"
      fireEvent.change(input, { target: { value: '1:mm aa' } });
      expectFieldValueV6(input, '01:mm aa');
      expect(getCleanedSelectedContent()).to.equal('01');

      // Press "3"
      fireEvent.change(input, { target: { value: '3:mm aa' } });
      expectFieldValueV6(input, '03:mm aa');
      expect(getCleanedSelectedContent()).to.equal('mm');
    });
  });

  describeAdapters('Letter editing', TimeField, ({ adapter, testFieldChange }) => {
    it('should not edit when props.readOnly = true and no value is provided (letter)', () => {
      testFieldChange({
        format: adapter.formats.meridiem,
        readOnly: true,
        keyStrokes: [{ value: 'a', expected: 'aa' }],
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided (letter)', () => {
      testFieldChange({
        format: adapter.formats.meridiem,
        defaultValue: adapter.date('2022-06-15T14:12:25'),
        readOnly: true,
        keyStrokes: [{ value: 'a', expected: 'PM' }],
      });
    });

    it('should set meridiem to AM when pressing "a" and no value is provided', () => {
      testFieldChange({
        format: adapter.formats.meridiem,
        selectedSection: 'meridiem',
        // Press "a"
        keyStrokes: [{ value: 'a', expected: 'AM' }],
      });
    });

    it('should set meridiem to PM when pressing "p" and no value is provided', () => {
      testFieldChange({
        format: adapter.formats.meridiem,
        selectedSection: 'meridiem',
        // Press "p"
        keyStrokes: [{ value: 'p', expected: 'PM' }],
      });
    });

    it('should set meridiem to AM when pressing "a" and a value is provided', () => {
      testFieldChange({
        format: adapter.formats.meridiem,
        defaultValue: adapter.date('2022-06-15T14:12:25'),
        selectedSection: 'meridiem',
        // Press "a"
        keyStrokes: [{ value: 'a', expected: 'AM' }],
      });
    });

    it('should set meridiem to PM when pressing "p" and a value is provided', () => {
      testFieldChange({
        format: adapter.formats.meridiem,
        defaultValue: adapter.date('2022-06-15T14:12:25'),
        selectedSection: 'meridiem',
        // Press "p"
        keyStrokes: [{ value: 'p', expected: 'PM' }],
      });
    });

    it('should not edit when pressing the Space key', () => {
      testFieldChange({
        format: adapter.formats.hours24h,
        keyStrokes: [{ value: ' ', expected: 'hh' }],
      });
    });
  });

  describeAdapters(
    'Do not loose missing section values ',
    TimeField,
    ({ adapter, renderWithProps }) => {
      it('should not loose date information when a value is provided', () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV7,
        });

        view.selectSection('hours');
        fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowDown' });

        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();

        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV6,
        });

        const input = getTextbox();
        view.selectSection('hours');
        fireEvent.keyDown(input, { key: 'ArrowDown' });

        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));
      });

      it('should not loose date information when cleaning the date then filling it again', () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV7,
          format: adapter.formats.fullTime24h,
        });

        view.selectSection('hours');
        fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });
        view.pressKey(null, '');
        fireEvent.keyDown(view.getSectionsContainer(), { key: 'ArrowLeft' });

        view.pressKey(0, '3');
        expectFieldValueV7(view.getSectionsContainer(), '03:mm');

        view.pressKey(1, '4');
        expectFieldValueV7(view.getSectionsContainer(), '03:04');
        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 3, 4, 3));

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();

        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV6,
          format: adapter.formats.fullTime24h,
        });

        const input = getTextbox();
        view.selectSection('hours');
        fireEvent.keyDown(input, { key: 'a', ctrlKey: true });
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.keyDown(input, { key: 'ArrowLeft' });

        fireEvent.change(input, { target: { value: '3:mm' } }); // Press "3"
        expectFieldValueV6(input, '03:mm');

        fireEvent.change(input, { target: { value: '03:4' } }); // Press "3"
        expectFieldValueV6(input, '03:04');
        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 3, 4, 3));
      });

      it('should not loose time information when using the hour format and value is provided', () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV7,
          format: adapter.formats.hours24h,
        });

        view.selectSection('hours');
        fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowDown' });

        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();

        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV6,
          format: adapter.formats.hours24h,
        });

        const input = getTextbox();
        view.selectSection('hours');
        fireEvent.keyDown(input, { key: 'ArrowDown' });

        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2010, 3, 3, 2, 3, 3));
      });
    },
  );

  describeAdapters('props: minutesStep', TimeField, ({ adapter, testFieldKeyPress }) => {
    it('should use `minutesStep` to set initial minutes with ArrowUp', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        key: 'ArrowUp',
        minutesStep: 5,
        expectedValue: '00',
      });
    });

    it('should use `minutesStep` to set initial minutes with ArrowDown', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        key: 'ArrowDown',
        minutesStep: 5,
        expectedValue: '00',
      });
    });

    it('should use `minutesStep` to increase minutes', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        defaultValue: adapter.date('2022-06-15T14:00:25'),
        key: 'ArrowUp',
        minutesStep: 5,
        expectedValue: '05',
      });
    });

    it('should use `minutesStep` to decrease minutes', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        defaultValue: adapter.date('2022-06-15T14:00:25'),
        key: 'ArrowDown',
        minutesStep: 5,
        expectedValue: '55',
      });
    });

    it('should go to the closest valid values according to `minutesStep` when pressing ArrowDown', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        defaultValue: adapter.date('2022-06-15T14:02:25'),
        key: 'ArrowDown',
        minutesStep: 5,
        expectedValue: '00',
      });
    });

    it('should go to the closest valid values according to `minutesStep` when pressing ArrowUp', () => {
      testFieldKeyPress({
        format: adapter.formats.minutes,
        defaultValue: adapter.date('2022-06-15T14:02:25'),
        key: 'ArrowUp',
        minutesStep: 5,
        expectedValue: '05',
      });
    });
  });
});

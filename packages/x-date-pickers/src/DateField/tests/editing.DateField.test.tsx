import { expect } from 'chai';
import { spy } from 'sinon';
import { DateField } from '@mui/x-date-pickers/DateField';
import { act, fireEvent } from '@mui/internal-test-utils';
import {
  expectFieldValueV7,
  getTextbox,
  describeAdapters,
  expectFieldValueV6,
} from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<DateField /> - Editing', () => {
  describeAdapters('key: ArrowDown', DateField, ({ adapter, testFieldKeyPress }) => {
    it("should set the year to today's value when no value is provided (ArrowDown)", () => {
      testFieldKeyPress({
        format: adapter.formats.year,
        key: 'ArrowDown',
        expectedValue: '2022',
      });
    });

    it('should decrement the year when a value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.year,
        defaultValue: adapter.date(),
        key: 'ArrowDown',
        expectedValue: '2021',
      });
    });

    it('should set the month to December when no value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.month,
        key: 'ArrowDown',
        expectedValue: 'December',
      });
    });

    it('should decrement the month when a value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.month,
        defaultValue: adapter.date(),
        key: 'ArrowDown',
        expectedValue: 'May',
      });
    });

    it('should go to the last month of the current year when a value in January is provided', () => {
      testFieldKeyPress({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date('2022-01-15'),
        key: 'ArrowDown',
        expectedValue: 'December 2022',
      });
    });

    it('should set the day to 31 when no value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.dayOfMonth,
        key: 'ArrowDown',
        expectedValue: '31',
      });
    });

    it('should decrement the day when a value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.dayOfMonth,
        defaultValue: adapter.date(),
        key: 'ArrowDown',
        expectedValue: '14',
      });
    });

    it('should decrement the month and keep the day when the new month has fewer days', () => {
      testFieldKeyPress({
        format: `${adapter.formats.month} ${adapter.formats.dayOfMonth}`,
        defaultValue: adapter.date('2022-05-31'),
        key: 'ArrowDown',
        expectedValue: 'April 31',
      });
    });

    it('should go to the last day of the current month when a value in the first day of the month is provided', () => {
      testFieldKeyPress({
        format: `${adapter.formats.month} ${adapter.formats.dayOfMonth}`,
        defaultValue: adapter.date('2022-06-01'),
        key: 'ArrowDown',
        expectedValue: 'June 30',
        selectedSection: 'day',
      });
    });

    it('should not edit the value when props.readOnly = true and no value is provided (ArrowDown)', () => {
      testFieldKeyPress({
        format: adapter.formats.year,
        readOnly: true,
        key: 'ArrowDown',
        expectedValue: 'YYYY',
      });
    });

    it('should not edit the value when props.readOnly = true and a value is provided (ArrowDown)', () => {
      testFieldKeyPress({
        format: adapter.formats.year,
        defaultValue: adapter.date(),
        readOnly: true,
        key: 'ArrowDown',
        expectedValue: '2022',
      });
    });
  });

  describeAdapters('key: ArrowUp', DateField, ({ adapter, testFieldKeyPress }) => {
    it("should set the year to today's value when no value is provided (ArrowUp)", () => {
      testFieldKeyPress({
        format: adapter.formats.year,
        key: 'ArrowUp',
        expectedValue: '2022',
      });
    });

    it('should increment the year when a value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.year,
        defaultValue: adapter.date(),
        key: 'ArrowUp',
        expectedValue: '2023',
      });
    });

    it('should set the month to January when no value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.month,
        key: 'ArrowUp',
        expectedValue: 'January',
      });
    });

    it('should increment the month when a value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.month,
        defaultValue: adapter.date(),
        key: 'ArrowUp',
        expectedValue: 'July',
      });
    });

    it('should go to the first month of the current year when a value in December is provided', () => {
      testFieldKeyPress({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date('2022-12-15'),
        key: 'ArrowUp',
        expectedValue: 'January 2022',
      });
    });

    it('should set the day 1 when no value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.dayOfMonth,
        key: 'ArrowUp',
        expectedValue: '01',
      });
    });

    it('should increment the day when a value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.dayOfMonth,
        defaultValue: adapter.date(),
        key: 'ArrowUp',
        expectedValue: '16',
      });
    });

    it('should increment the month and keep the day when the new month has fewer days', () => {
      testFieldKeyPress({
        format: `${adapter.formats.month} ${adapter.formats.dayOfMonth}`,
        defaultValue: adapter.date('2022-05-31'),
        key: 'ArrowUp',
        expectedValue: 'June 31',
      });
    });

    it('should go to the first day of the current month when a value in the last day of the month is provided', () => {
      testFieldKeyPress({
        format: `${adapter.formats.month} ${adapter.formats.dayOfMonth}`,
        defaultValue: adapter.date('2022-06-30'),
        key: 'ArrowUp',
        expectedValue: 'June 01',
        selectedSection: 'day',
      });
    });

    it('should not edit the value when props.readOnly = true and no value is provided (ArrowUp)', () => {
      testFieldKeyPress({
        format: adapter.formats.year,
        readOnly: true,
        key: 'ArrowUp',
        expectedValue: 'YYYY',
      });
    });

    it('should not edit the value when props.readOnly = true and a value is provided (ArrowUp)', () => {
      testFieldKeyPress({
        format: adapter.formats.year,
        defaultValue: adapter.date(),
        readOnly: true,
        key: 'ArrowUp',
        expectedValue: '2022',
      });
    });
  });

  describeAdapters('key: Delete', DateField, ({ adapter, testFieldKeyPress, renderWithProps }) => {
    it('should clear the selected section when only this section is completed', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      view.selectSection('month');

      // Set a value for the "month" section
      view.pressKey(0, 'j');
      expectFieldValueV7(view.getSectionsContainer(), 'January YYYY');

      fireUserEvent.keyPress(view.getActiveSection(0), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Set a value for the "month" section
      fireEvent.change(input, {
        target: { value: 'j YYYY' },
      }); // press "j"
      expectFieldValueV6(input, 'January YYYY');

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expectFieldValueV6(input, 'MMMM YYYY');
    });

    it('should clear the selected section when all sections are completed', () => {
      testFieldKeyPress({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date(),
        key: 'Delete',
        expectedValue: 'MMMM 2022',
      });
    });

    it('should clear all the sections when all sections are selected and all sections are completed', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date(),
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      fireUserEvent.keyPress(view.getSectionsContainer(), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date(),
      });

      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', ctrlKey: true });

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expectFieldValueV6(input, 'MMMM YYYY');
    });

    it('should clear all the sections when all sections are selected and not all sections are completed', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      view.selectSection('month');

      // Set a value for the "month" section
      view.pressKey(0, 'j');
      expectFieldValueV7(view.getSectionsContainer(), 'January YYYY');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      fireUserEvent.keyPress(view.getSectionsContainer(), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Set a value for the "month" section
      fireEvent.change(input, {
        target: { value: 'j YYYY' },
      }); // Press "j"
      expectFieldValueV6(input, 'January YYYY');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', ctrlKey: true });

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expectFieldValueV6(input, 'MMMM YYYY');
    });

    it('should not keep query after typing again on a cleared section', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: adapter.formats.year,
      });

      view.selectSection('year');

      view.pressKey(0, '2');
      expectFieldValueV7(view.getSectionsContainer(), '0002');

      fireUserEvent.keyPress(view.getActiveSection(0), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'YYYY');

      view.pressKey(0, '2');
      expectFieldValueV7(view.getSectionsContainer(), '0002');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: adapter.formats.year,
      });

      const input = getTextbox();
      view.selectSection('year');

      fireEvent.change(input, { target: { value: '2' } }); // press "2"
      expectFieldValueV6(input, '0002');

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expectFieldValueV6(input, 'YYYY');

      fireEvent.change(input, { target: { value: '2' } }); // press "2"
      expectFieldValueV6(input, '0002');
    });

    it('should not clear the sections when props.readOnly = true', () => {
      testFieldKeyPress({
        format: adapter.formats.year,
        defaultValue: adapter.date(),
        readOnly: true,
        key: 'Delete',
        expectedValue: '2022',
      });
    });

    it('should not call `onChange` when clearing all sections and both dates are already empty', () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        onChange: onChangeV7,
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      fireUserEvent.keyPress(view.getSectionsContainer(), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(0);

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();

      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        onChange: onChangeV6,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', ctrlKey: true });

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(0);
    });

    it('should call `onChange` when clearing the first and last section', () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date(),
        onChange: onChangeV7,
      });

      view.selectSection('month');

      fireUserEvent.keyPress(view.getActiveSection(0), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);
      expect(onChangeV7.lastCall.args[1].validationError).to.equal('invalidDate');

      fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });

      fireUserEvent.keyPress(view.getActiveSection(1), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(2);
      expect(onChangeV7.lastCall.firstArg).to.equal(null);
      expect(onChangeV7.lastCall.args[1].validationError).to.equal(null);

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();

      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date(),
        onChange: onChangeV6,
      });

      const input = getTextbox();
      view.selectSection('month');

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(1);
      expect(onChangeV6.lastCall.args[1].validationError).to.equal('invalidDate');

      fireUserEvent.keyPress(input, { key: 'ArrowRight' });

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(2);
      expect(onChangeV6.lastCall.firstArg).to.equal(null);
      expect(onChangeV6.lastCall.args[1].validationError).to.equal(null);
    });

    it('should not call `onChange` if the section is already empty', () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date(),
        onChange: onChangeV7,
      });

      view.selectSection('month');

      fireUserEvent.keyPress(view.getActiveSection(0), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);

      fireUserEvent.keyPress(view.getActiveSection(0), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();

      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date(),
        onChange: onChangeV6,
      });

      const input = getTextbox();
      view.selectSection('month');

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(1);

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(1);
    });
  });

  describeAdapters('key: PageUp', DateField, ({ adapter, testFieldKeyPress }) => {
    describe('day section (PageUp)', () => {
      it('should set day to minimal when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.dayOfMonth,
          key: 'PageUp',
          expectedValue: '01',
        });
      });

      it('should increment day by 5 when value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.dayOfMonth,
          defaultValue: adapter.date('2022-01-15'),
          key: 'PageUp',
          expectedValue: '20',
        });
      });

      it('should flip day field when value is higher than 27', () => {
        testFieldKeyPress({
          format: adapter.formats.dayOfMonth,
          defaultValue: adapter.date('2022-01-28'),
          key: 'PageUp',
          expectedValue: '02',
        });
      });
    });

    describe('weekday section (PageUp)', () => {
      it('should set weekday to Sunday when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.weekday,
          key: 'PageUp',
          expectedValue: 'Sunday',
        });
      });

      it('should increment weekday by 5 when value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.weekday,
          defaultValue: adapter.date('2024-06-03'),
          key: 'PageUp',
          expectedValue: 'Saturday',
        });
      });

      it('should flip weekday field when value is higher than 3', () => {
        testFieldKeyPress({
          format: adapter.formats.weekday,
          defaultValue: adapter.date('2024-06-07'),
          key: 'PageUp',
          expectedValue: 'Wednesday',
        });
      });
    });

    describe('month section (PageUp)', () => {
      it('should set month to January when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.month,
          key: 'PageUp',
          expectedValue: 'January',
        });
      });

      it('should increment month by 5 when value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.month,
          defaultValue: adapter.date('2022-01-15'),
          key: 'PageUp',
          expectedValue: 'June',
        });
      });

      it('should flip month field when value is higher than 7', () => {
        testFieldKeyPress({
          format: adapter.formats.month,
          defaultValue: adapter.date('2022-08-15'),
          key: 'PageUp',
          expectedValue: 'January',
        });
      });
    });

    describe('year section (PageUp)', () => {
      it('should set year to current year when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.year,
          key: 'PageUp',
          expectedValue: new Date().getFullYear().toString(),
        });
      });

      it('should increment year by 5 when value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.year,
          defaultValue: adapter.date('2022-01-15'),
          key: 'PageUp',
          expectedValue: '2027',
        });
      });

      it('should flip year field when value is higher than 9995', () => {
        testFieldKeyPress({
          format: adapter.formats.year,
          defaultValue: adapter.date('9996-01-15'),
          key: 'PageUp',
          expectedValue: '0001',
        });
      });
    });
  });

  describeAdapters('key: PageDown', DateField, ({ adapter, testFieldKeyPress }) => {
    describe('day section (PageDown)', () => {
      it('should set day to maximal when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.dayOfMonth,
          key: 'PageDown',
          expectedValue: '31',
        });
      });

      it('should decrement day by 5 when value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.dayOfMonth,
          defaultValue: adapter.date('2022-01-15'),
          key: 'PageDown',
          expectedValue: '10',
        });
      });

      it('should flip day field when value is lower than 5', () => {
        testFieldKeyPress({
          format: adapter.formats.dayOfMonth,
          defaultValue: adapter.date('2022-01-04'),
          key: 'PageDown',
          expectedValue: '30',
        });
      });
    });

    describe('weekday section (PageDown)', () => {
      it('should set weekday to Saturday when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.weekday,
          key: 'PageDown',
          expectedValue: 'Saturday',
        });
      });

      it('should decrement weekday by 5 when value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.weekday,
          defaultValue: adapter.date('2024-06-22'),
          key: 'PageDown',
          expectedValue: 'Monday',
        });
      });

      it('should flip weekday field when value is lower than 5', () => {
        testFieldKeyPress({
          format: adapter.formats.weekday,
          defaultValue: adapter.date('2024-06-23'),
          key: 'PageDown',
          expectedValue: 'Tuesday',
        });
      });
    });

    describe('month section (PageDown)', () => {
      it('should set month to December when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.month,
          key: 'PageDown',
          expectedValue: 'December',
        });
      });

      it('should decrement month by 5 when value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.month,
          defaultValue: adapter.date('2022-10-15'),
          key: 'PageDown',
          expectedValue: 'May',
        });
      });

      it('should flip month field when value is lower than 5', () => {
        testFieldKeyPress({
          format: adapter.formats.month,
          defaultValue: adapter.date('2022-04-15'),
          key: 'PageDown',
          expectedValue: 'November',
        });
      });
    });

    describe('year section (PageDown)', () => {
      it('should set year to current year when no value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.year,
          key: 'PageDown',
          expectedValue: new Date().getFullYear().toString(),
        });
      });

      it('should decrement year by 5 when value is provided', () => {
        testFieldKeyPress({
          format: adapter.formats.year,
          defaultValue: adapter.date('2022-01-15'),
          key: 'PageDown',
          expectedValue: '2017',
        });
      });

      it('should flip year field when value is lower than 5', () => {
        testFieldKeyPress({
          format: adapter.formats.year,
          defaultValue: adapter.date('0003-01-15'),
          key: 'PageDown',
          expectedValue: adapter.lib === 'dayjs' ? '1898' : '9998',
        });
      });
    });
  });

  describeAdapters('Disabled field', DateField, ({ renderWithProps }) => {
    it('should not allow key editing on disabled field', () => {
      // Test with v7 input
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
        disabled: true,
      });

      const keys = [
        'ArrowUp',
        'ArrowDown',
        'PageUp',
        'PageDown',
        'Home',
        'End',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
      ];

      view.selectSection('month');

      keys.forEach((key) => {
        view.pressKey(0, key);
        expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
        expect(onChangeV7.callCount).to.equal(0);
      });

      // digit key press
      fireUserEvent.keyPress(view.getActiveSection(0), { key: '2' });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();
      view = renderWithProps({
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
        disabled: true,
      });

      const input = getTextbox();
      view.selectSection('month');

      // v6 doesn't allow focusing on sections when disabled
      keys.forEach((key) => {
        fireEvent.change(input, { target: { value: key } });
        expect(document.activeElement).not.to.equal(input);
        expectFieldValueV6(input, '');
      });
      expect(onChangeV6.callCount).to.equal(0);
    });
  });

  describeAdapters('Digit editing', DateField, ({ adapter, testFieldChange, renderWithProps }) => {
    it('should set the day to the digit pressed when no digit no value is provided', () => {
      testFieldChange({
        format: adapter.formats.dayOfMonth,
        keyStrokes: [{ value: '1', expected: '01' }],
      });
    });

    it('should concatenate the digit pressed to the current section value if the output is valid (digit format)', () => {
      testFieldChange({
        format: adapter.formats.dayOfMonth,
        defaultValue: adapter.date('2022-06-01'),
        keyStrokes: [
          { value: '1', expected: '01' },
          { value: '1', expected: '11' },
        ],
      });
    });

    it('should set the day to the digit pressed if the concatenated value exceeds the maximum value for the section when a value is provided (digit format)', () => {
      testFieldChange({
        format: adapter.formats.dayOfMonth,
        defaultValue: adapter.date('2022-06-04'),
        keyStrokes: [{ value: '1', expected: '01' }],
      });
    });

    it('should concatenate the digit pressed to the current section value if the output is valid (letter format)', () => {
      testFieldChange({
        format: adapter.formats.month,
        defaultValue: adapter.date('2022-02-01'),
        keyStrokes: [
          { value: '1', expected: 'January' },
          { value: '1', expected: 'November' },
        ],
      });
    });

    it('should set the day to the digit pressed if the concatenated value exceeds the maximum value for the section when a value is provided (letter format)', () => {
      testFieldChange({
        format: adapter.formats.month,
        defaultValue: adapter.date('2022-06-01'),
        keyStrokes: [{ value: '1', expected: 'January' }],
      });
    });

    it('should support 2-digits year format', () => {
      testFieldChange({
        // This format is not present in any of the adapter formats
        format: adapter.lib.includes('moment') || adapter.lib.includes('dayjs') ? 'YY' : 'yy',
        keyStrokes: [
          // 1st year: 22
          { value: '2', expected: '02' },
          { value: '2', expected: '22' },
          // 2nd year: 32
          { value: '3', expected: '03' },
          { value: '2', expected: '32' },
          // 3rd year: 00
          { value: '0', expected: '00' },
        ],
      });
    });

    it('should support 2-digits year format when a value is provided', () => {
      testFieldChange({
        // This format is not present in any of the adapter formats
        format: adapter.lib.includes('moment') || adapter.lib.includes('dayjs') ? 'YY' : 'yy',
        defaultValue: adapter.date('2022-06-04'),
        keyStrokes: [
          { value: '2', expected: '02' },
          { value: '2', expected: '22' },
          { value: '3', expected: '03' },
        ],
      });
    });

    it('should support 4-digits year format', () => {
      testFieldChange({
        format: adapter.formats.year,
        keyStrokes: [
          { value: '2', expected: '0002' },
          { value: '0', expected: '0020' },
          { value: '2', expected: '0202' },
          { value: '2', expected: '2022' },
          { value: '2', expected: '0002' },
          { value: '0', expected: '0020' },
          { value: '2', expected: '0202' },
          { value: '3', expected: '2023' },
        ],
      });
    });

    it('should support 4-digits year format when a value is provided', () => {
      testFieldChange({
        format: adapter.formats.year,
        defaultValue: adapter.date('2022-06-04'),
        keyStrokes: [
          { value: '2', expected: '0002' },
          { value: '0', expected: '0020' },
          { value: '2', expected: '0202' },
          { value: '2', expected: '2022' },
          { value: '2', expected: '0002' },
          { value: '0', expected: '0020' },
          { value: '2', expected: '0202' },
          { value: '3', expected: '2023' },
        ],
      });
    });

    it('should support month without trailing zeros format', () => {
      testFieldChange({
        format: 'M', // This format is not present in any of the adapter formats
        keyStrokes: [
          { value: '1', expected: '1' },
          { value: '1', expected: '11' },
          { value: '2', expected: '2' },
        ],
        shouldRespectLeadingZeros: true,
      });
    });

    it('should support day with letter suffix', function test() {
      // Luxon don't have any day format with a letter suffix
      if (adapter.lib === 'luxon') {
        this.skip();
      }

      testFieldChange({
        format: adapter.lib === 'date-fns' ? 'do' : 'Do',
        keyStrokes: [
          { value: '1', expected: '1st' },
          { value: '2', expected: '12th' },
          { value: '2', expected: '2nd' },
        ],
      });
    });

    it('should respect leading zeros when shouldRespectLeadingZeros = true', () => {
      testFieldChange({
        format: ['luxon', 'date-fns'].includes(adapter.lib) ? 'd' : 'D',
        shouldRespectLeadingZeros: true,
        keyStrokes: [
          { value: '1', expected: '1' },
          { value: '2', expected: '12' },
          { value: '2', expected: '2' },
        ],
      });
    });

    it('should not respect leading zeros when shouldRespectLeadingZeros = false', () => {
      testFieldChange({
        format: ['luxon', 'date-fns'].includes(adapter.lib) ? 'd' : 'D',
        shouldRespectLeadingZeros: false,
        keyStrokes: [
          { value: '1', expected: '01' },
          { value: '2', expected: '12' },
          { value: '2', expected: '02' },
        ],
      });
    });

    it('should allow to type the date 29th of February for leap years', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: adapter.formats.keyboardDate,
      });

      view.selectSection('month');

      view.pressKey(0, '2');
      expectFieldValueV7(view.getSectionsContainer(), '02/DD/YYYY');

      view.pressKey(1, '2');
      expectFieldValueV7(view.getSectionsContainer(), '02/02/YYYY');

      view.pressKey(1, '9');
      expectFieldValueV7(view.getSectionsContainer(), '02/29/YYYY');

      view.pressKey(2, '1');
      expectFieldValueV7(view.getSectionsContainer(), '02/29/0001');

      view.pressKey(2, '9');
      expectFieldValueV7(view.getSectionsContainer(), '02/29/0019');

      view.pressKey(2, '8');
      expectFieldValueV7(view.getSectionsContainer(), '02/29/0198');

      view.pressKey(2, '8');
      expectFieldValueV7(view.getSectionsContainer(), '02/29/1988');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: adapter.formats.keyboardDate,
      });

      const input = getTextbox();
      view.selectSection('month');

      fireEvent.change(input, { target: { value: '2/DD/YYYY' } });
      expectFieldValueV6(input, '02/DD/YYYY');

      fireEvent.change(input, { target: { value: '02/2/YYYY' } });
      expectFieldValueV6(input, '02/02/YYYY');

      fireEvent.change(input, { target: { value: '02/9/YYYY' } });
      expectFieldValueV6(input, '02/29/YYYY');

      fireEvent.change(input, { target: { value: '02/29/1' } });
      expectFieldValueV6(input, '02/29/0001');

      fireEvent.change(input, { target: { value: '02/29/9' } });
      expectFieldValueV6(input, '02/29/0019');

      fireEvent.change(input, { target: { value: '02/29/8' } });
      expectFieldValueV6(input, '02/29/0198');

      fireEvent.change(input, { target: { value: '02/29/8' } });
      expectFieldValueV6(input, '02/29/1988');
    });

    it('should not edit when props.readOnly = true and no value is provided', () => {
      testFieldChange({
        format: adapter.formats.year,
        readOnly: true,
        keyStrokes: [{ value: '1', expected: 'YYYY' }],
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided', () => {
      testFieldChange({
        format: adapter.formats.year,
        defaultValue: adapter.date(),
        readOnly: true,
        keyStrokes: [{ value: '1', expected: '2022' }],
      });
    });
  });

  describeAdapters(
    'Letter editing',
    DateField,
    ({ adapter, testFieldChange, testFieldKeyPress }) => {
      it('should select the first matching month with no previous query and no value is provided (letter format)', () => {
        testFieldChange({
          format: adapter.formats.month,
          keyStrokes: [{ value: 'm', expected: 'March' }],
        });
      });

      it('should select the first matching month with no previous query and a value is provided (letter format)', () => {
        testFieldChange({
          format: adapter.formats.month,
          defaultValue: adapter.date(),
          keyStrokes: [{ value: 'm', expected: 'March' }],
        });
      });

      it('should use the previously typed letters as long as it matches at least one month (letter format)', () => {
        testFieldChange({
          format: adapter.formats.month,
          keyStrokes: [
            // Current query: "J" => 3 matches
            { value: 'j', expected: 'January' },
            // Current query: "JU" => 2 matches
            { value: 'u', expected: 'June' },
            // Current query: "JUL" => 1 match
            { value: 'l', expected: 'July' },
            // Current query: "JULO" => 0 match => fallback set the query to "O"
            { value: 'o', expected: 'October' },
          ],
        });
      });

      it('should select the first matching month with no previous query and no value is provided (digit format)', () => {
        testFieldChange({
          format: 'MM', // This format is not present in any of the adapter formats
          keyStrokes: [{ value: 'm', expected: '03' }],
        });
      });

      it('should select the first matching month with no previous query and a value is provided (digit format)', () => {
        testFieldChange({
          format: 'MM', // This format is not present in any of the adapter formats
          defaultValue: adapter.date(),
          keyStrokes: [{ value: 'm', expected: '03' }],
        });
      });

      it('should use the previously typed letters as long as it matches at least one month (digit format)', () => {
        testFieldChange({
          format: 'MM', // This format is not present in any of the adapter formats
          keyStrokes: [
            // Current query: "J" => 3 matches
            { value: 'j', expected: '01' },
            // Current query: "JU" => 2 matches
            { value: 'u', expected: '06' },
            // Current query: "JUL" => 1 match
            { value: 'l', expected: '07' },
            // Current query: "JULO" => 0 match => fallback set the query to "O"
            { value: 'o', expected: '10' },
          ],
        });
      });

      it('should not edit when props.readOnly = true and no value is provided (letter)', () => {
        testFieldKeyPress({
          format: adapter.formats.month,
          readOnly: true,
          key: '1',
          expectedValue: 'MMMM',
        });
      });

      it('should not edit value when props.readOnly = true and a value is provided (letter)', () => {
        testFieldKeyPress({
          format: adapter.formats.month,
          defaultValue: adapter.date(),
          readOnly: true,
          key: 'd',
          expectedValue: 'June',
        });
      });
    },
  );

  describeAdapters(
    `Backspace editing`,
    DateField,
    ({ adapter, renderWithProps, testFieldChange }) => {
      it('should clear the selected section when only this section is completed (Backspace)', () => {
        // Test with v7 input
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        view.selectSection('month');
        view.pressKey(0, 'j');
        expectFieldValueV7(view.getSectionsContainer(), 'January YYYY');

        view.pressKey(0, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY');

        view.unmount();

        // Test with v6 input
        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');
        fireEvent.change(input, { target: { value: 'j YYYY' } });
        expectFieldValueV6(input, 'January YYYY');

        fireEvent.change(input, { target: { value: ' YYYY' } });
        expectFieldValueV6(input, 'MMMM YYYY');
      });

      it('should clear the selected section when all sections are completed (Backspace)', () => {
        // Test with v7 input
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: adapter.date(),
        });

        view.selectSection('month');

        view.pressKey(0, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM 2022');

        view.unmount();

        // Test with v6 input
        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: adapter.date(),
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');

        fireEvent.change(input, { target: { value: ' 2022' } });
        expectFieldValueV6(input, 'MMMM 2022');
      });

      it('should clear all the sections when all sections are selected and all sections are completed (Backspace)', () => {
        // Test with v7 input
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: adapter.date(),
        });

        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

        view.pressKey(null, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY');

        view.unmount();

        // Test with v6 input
        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: adapter.date(),
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(input, { key: 'a', ctrlKey: true });

        fireEvent.change(input, { target: { value: '' } });
        expectFieldValueV6(input, 'MMMM YYYY');
      });

      it('should clear all the sections when all sections are selected and not all sections are completed (Backspace)', () => {
        // Test with v7 input
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        view.selectSection('month');
        view.pressKey(0, 'j');
        expectFieldValueV7(view.getSectionsContainer(), 'January YYYY');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

        view.pressKey(null, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY');

        view.unmount();

        // Test with v6 input
        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');
        fireEvent.change(input, { target: { value: 'j YYYY' } });
        expectFieldValueV6(input, 'January YYYY');

        // Select all sections
        fireEvent.keyDown(input, { key: 'a', ctrlKey: true });

        fireEvent.change(input, { target: { value: '' } });
        expectFieldValueV6(input, 'MMMM YYYY');
      });

      it('should not keep query after typing again on a cleared section (Backspace)', () => {
        testFieldChange({
          format: adapter.formats.year,
          keyStrokes: [
            { value: '2', expected: '0002' },
            { value: '', expected: 'YYYY' },
            { value: '2', expected: '0002' },
          ],
        });
      });

      it('should not clear the sections when props.readOnly = true (Backspace)', () => {
        testFieldChange({
          format: adapter.formats.year,
          defaultValue: adapter.date(),
          readOnly: true,
          keyStrokes: [{ value: '', expected: '2022' }],
        });
      });

      it('should not call `onChange` when clearing all sections and both dates are already empty (Backspace)', () => {
        const onChange = spy();

        testFieldChange({
          format: adapter.formats.year,
          onChange,
          keyStrokes: [{ value: '', expected: 'YYYY' }],
        });

        expect(onChange.callCount).to.equal(0);
      });

      it('should call `onChange` when clearing the first and last section (Backspace)', () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: adapter.date(),
          onChange: onChangeV7,
        });

        view.selectSection('month');
        view.pressKey(0, '');
        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.args[1].validationError).to.equal('invalidDate');

        view.selectSection('year');
        view.pressKey(1, '');
        expect(onChangeV7.callCount).to.equal(2);
        expect(onChangeV7.lastCall.firstArg).to.equal(null);
        expect(onChangeV7.lastCall.args[1].validationError).to.equal(null);

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();

        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: adapter.date(),
          onChange: onChangeV6,
        });

        const input = getTextbox();
        view.selectSection('month');
        fireEvent.change(input, { target: { value: ' 2022' } });
        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV6.lastCall.args[1].validationError).to.equal('invalidDate');

        fireUserEvent.keyPress(input, { key: 'ArrowRight' });

        fireEvent.change(input, { target: { value: 'MMMM ' } });
        expect(onChangeV6.callCount).to.equal(2);
        expect(onChangeV6.lastCall.firstArg).to.equal(null);
        expect(onChangeV6.lastCall.args[1].validationError).to.equal(null);
      });

      it('should not call `onChange` if the section is already empty (Backspace)', () => {
        const onChange = spy();

        testFieldChange({
          format: adapter.formats.year,
          defaultValue: adapter.date(),
          keyStrokes: [
            { value: '', expected: 'YYYY' },
            { value: '', expected: 'YYYY' },
          ],
          onChange,
        });

        // 1 for v7 and 1 for v7 input
        expect(onChange.callCount).to.equal(2);
      });
    },
  );

  describeAdapters('Pasting', DateField, ({ adapter, renderWithProps }) => {
    const firePasteEventV7 = (element: HTMLElement, pastedValue: string) => {
      const clipboardEvent = new window.Event('paste', {
        bubbles: true,
        cancelable: true,
        composed: true,
      });

      // @ts-ignore
      clipboardEvent.clipboardData = {
        getData: () => pastedValue,
      };
      let canContinue = true;
      act(() => {
        // canContinue is `false` if default have been prevented
        canContinue = element.dispatchEvent(clipboardEvent);
      });
      if (!canContinue) {
        return;
      }

      fireEvent.input(element, { target: { textContent: pastedValue } });
    };

    const firePasteEventV6 = (input: HTMLInputElement, pastedValue?: string, rawValue?: string) => {
      const clipboardEvent = new window.Event('paste', {
        bubbles: true,
        cancelable: true,
        composed: true,
      });

      // @ts-ignore
      clipboardEvent.clipboardData = {
        getData: () => pastedValue ?? rawValue ?? '',
      };
      let canContinue = true;
      act(() => {
        // canContinue is `false` if default have been prevented
        canContinue = input.dispatchEvent(clipboardEvent);
      });
      if (!canContinue) {
        return;
      }

      if (!pastedValue) {
        return;
      }

      const prevValue = input.value;
      const nextValue = `${prevValue.slice(
        0,
        input.selectionStart || 0,
      )}${pastedValue}${prevValue.slice(input.selectionEnd || 0)}`;
      fireEvent.change(input, { target: { value: nextValue } });
    };

    it('should set the date when all sections are selected, the pasted value is valid and a value is provided', () => {
      // Test with v7 input
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date(),
        onChange: onChangeV7,
      });
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      firePasteEventV7(view.getSectionsContainer(), '09/16/2022');

      expect(onChangeV7.callCount).to.equal(1);
      expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();
      view = renderWithProps({
        defaultValue: adapter.date(),
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
      });
      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEventV6(input, '09/16/2022');

      expect(onChangeV6.callCount).to.equal(1);
      expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
    });

    it('should set the date when all sections are selected, the pasted value is valid and no value is provided', () => {
      // Test with v7 input
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
      });
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      firePasteEventV7(view.getSectionsContainer(), '09/16/2022');

      expect(onChangeV7.callCount).to.equal(1);
      expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();
      view = renderWithProps({
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
      });
      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEventV6(input, '09/16/2022');

      expect(onChangeV6.callCount).to.equal(1);
      expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
    });

    it('should not set the date when all sections are selected and the pasted value is not valid', () => {
      // Test with v7 input
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
      });
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      firePasteEventV7(view.getSectionsContainer(), 'Some invalid content');
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();
      view = renderWithProps({
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
      });
      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEventV6(input, 'Some invalid content');
      expectFieldValueV6(input, 'MM/DD/YYYY');
    });

    it('should set the date when all sections are selected and the format contains escaped characters', () => {
      const { start: startChar, end: endChar } = adapter.escapedCharacters;

      // Test with v7 input
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
        format: `${startChar}Escaped${endChar} ${adapter.formats.year}`,
      });

      view.selectSection('year');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      firePasteEventV7(view.getSectionsContainer(), `Escaped 2014`);
      expect(onChangeV7.callCount).to.equal(1);
      expect(adapter.getYear(onChangeV7.lastCall.firstArg)).to.equal(2014);
      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();
      view = renderWithProps({
        onChange: onChangeV6,
        format: `${startChar}Escaped${endChar} ${adapter.formats.year}`,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('year');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEventV6(input, `Escaped 2014`);
      expect(onChangeV6.callCount).to.equal(1);
      expect(adapter.getYear(onChangeV6.lastCall.firstArg)).to.equal(2014);
    });

    it('should not set the date when all sections are selected and props.readOnly = true', () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
        readOnly: true,
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      firePasteEventV7(view.getSectionsContainer(), '09/16/2022');
      expect(onChangeV7.callCount).to.equal(0);

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();

      view = renderWithProps({
        onChange: onChangeV6,
        readOnly: true,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEventV6(input, '09/16/2022');
      expect(onChangeV6.callCount).to.equal(0);
    });

    it('should set the section when one section is selected, the pasted value has the correct type and no value is provided', () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
      });

      view.selectSection('month');

      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      firePasteEventV7(view.getActiveSection(0), '12');

      expect(onChangeV7.callCount).to.equal(1);
      expectFieldValueV7(view.getSectionsContainer(), '12/DD/YYYY');

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();

      view = renderWithProps({
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('month');

      expectFieldValueV6(input, 'MM/DD/YYYY');
      firePasteEventV6(input, '12');

      expect(onChangeV6.callCount).to.equal(1);
      expectFieldValueV6(input, '12/DD/YYYY');
    });

    it('should set the section when one section is selected, the pasted value has the correct type and value is provided', () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date('2018-01-13'),
        onChange: onChangeV7,
      });

      view.selectSection('month');

      expectFieldValueV7(view.getSectionsContainer(), '01/13/2018');
      firePasteEventV7(view.getActiveSection(0), '12');
      expectFieldValueV7(view.getSectionsContainer(), '12/13/2018');
      expect(onChangeV7.callCount).to.equal(1);
      expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2018, 11, 13));

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();

      view = renderWithProps({
        defaultValue: adapter.date('2018-01-13'),
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('month');

      expectFieldValueV6(input, '01/13/2018');
      firePasteEventV6(input, '12');
      expectFieldValueV6(input, '12/13/2018');
      expect(onChangeV6.callCount).to.equal(1);
      expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2018, 11, 13));
    });

    it('should not update the section when one section is selected and the pasted value has incorrect type', () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date('2018-01-13'),
        onChange: onChangeV7,
      });

      view.selectSection('month');

      expectFieldValueV7(view.getSectionsContainer(), '01/13/2018');
      firePasteEventV7(view.getActiveSection(0), 'Jun');
      expectFieldValueV7(view.getSectionsContainer(), '01/13/2018');
      expect(onChangeV7.callCount).to.equal(0);

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();

      view = renderWithProps({
        defaultValue: adapter.date('2018-01-13'),
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('month');

      expectFieldValueV6(input, '01/13/2018');
      firePasteEventV6(input, 'Jun');
      expectFieldValueV6(input, '01/13/2018');
      expect(onChangeV6.callCount).to.equal(0);
    });

    it('should reset sections internal state when pasting', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date('2018-12-05'),
      });

      view.selectSection('day');

      view.pressKey(1, '2');
      expectFieldValueV7(view.getSectionsContainer(), '12/02/2018');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(1), { key: 'a', ctrlKey: true });

      firePasteEventV7(view.getSectionsContainer(), '09/16/2022');
      expectFieldValueV7(view.getSectionsContainer(), '09/16/2022');

      view.selectSection('day');

      view.pressKey(1, '2'); // Press 2
      expectFieldValueV7(view.getSectionsContainer(), '09/02/2022'); // If internal state is not reset it would be 22 instead of 02

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        defaultValue: adapter.date('2018-12-05'),
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('day');

      fireEvent.change(input, { target: { value: '12/2/2018' } }); // Press 2
      expectFieldValueV6(input, '12/02/2018');

      firePasteEventV6(input, '09/16/2022');
      expectFieldValueV6(input, '09/16/2022');

      fireEvent.change(input, { target: { value: '09/2/2022' } }); // Press 2
      expectFieldValueV6(input, '09/02/2022'); // If internal state is not reset it would be 22 instead of 02
    });

    it('should allow pasting a section', () => {
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date('2018-12-05'),
      });

      view.selectSection('month');

      view.pressKey(0, '1'); // Press 1
      expectFieldValueV7(view.getSectionsContainer(), '01/05/2018');

      firePasteEventV7(view.getActiveSection(0), '05');
      expectFieldValueV7(view.getSectionsContainer(), '05/05/2018');

      view.selectSection('month'); // move back to month section
      view.pressKey(0, '2'); // check that the search query has been cleared after pasting
      expectFieldValueV7(view.getSectionsContainer(), '02/05/2018'); // If internal state is not reset it would be 12 instead of 02

      view.unmount();

      view = renderWithProps({
        defaultValue: adapter.date('2018-12-05'),
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('month');

      fireEvent.change(input, { target: { value: '1/05/2018' } }); // initiate search query on month section
      expectFieldValueV6(input, '01/05/2018');

      firePasteEventV6(input, undefined, '05');
      expectFieldValueV6(input, '05/05/2018');

      view.selectSection('month'); // move back to month section
      fireEvent.change(input, { target: { value: '2/05/2018' } }); // check that the search query has been cleared after pasting
      expectFieldValueV6(input, '02/05/2018'); // If internal state is not reset it would be 12 instead of 02
    });

    it('should not allow pasting on disabled field', () => {
      // Test with v7 input
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
        disabled: true,
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      firePasteEventV7(view.getSectionsContainer(), '09/16/2022');
      expect(onChangeV7.callCount).to.equal(0);
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();
      view = renderWithProps({
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
        disabled: true,
      });
      const input = getTextbox();
      view.selectSection('month');
      firePasteEventV6(input, '9');

      // v6 doesn't allow focusing on sections when disabled
      expect(document.activeElement).not.to.equal(input);
      expect(onChangeV6.callCount).to.equal(0);
      expectFieldValueV6(input, '');
    });
  });

  describeAdapters(
    'Do not loose missing section values ',
    DateField,
    ({ adapter, renderWithProps }) => {
      it('should not loose time information when a value is provided', () => {
        // Test with v7 input
        const onChangeV7 = spy();
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV7,
        });
        view.selectSection('year');
        fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowDown' });
        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();
        view = renderWithProps({
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV6,
          enableAccessibleFieldDOMStructure: false,
        });
        const input = getTextbox();
        view.selectSection('year');
        fireUserEvent.keyPress(input, { key: 'ArrowDown' });
        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
      });

      it('should not loose time information when cleaning the date then filling it again', () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV7,
        });

        view.selectSection('month');
        fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });
        view.pressKey(null, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
        view.selectSection('month');

        view.pressKey(0, '1');
        expectFieldValueV7(view.getSectionsContainer(), '01/DD/YYYY');

        view.pressKey(0, '1');
        expectFieldValueV7(view.getSectionsContainer(), '11/DD/YYYY');

        view.pressKey(1, '2');
        view.pressKey(1, '5');
        expectFieldValueV7(view.getSectionsContainer(), '11/25/YYYY');

        view.pressKey(2, '2');
        view.pressKey(2, '0');
        view.pressKey(2, '0');
        view.pressKey(2, '9');
        expectFieldValueV7(view.getSectionsContainer(), '11/25/2009');
        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2009, 10, 25, 3, 3, 3));

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();

        view = renderWithProps({
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV6,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');
        fireUserEvent.keyPress(input, { key: 'a', ctrlKey: true });
        fireEvent.change(input, { target: { value: '' } });
        fireUserEvent.keyPress(input, { key: 'ArrowLeft' });

        fireEvent.change(input, { target: { value: '1/DD/YYYY' } }); // Press "1"
        expectFieldValueV6(input, '01/DD/YYYY');

        fireEvent.change(input, { target: { value: '11/DD/YYYY' } }); // Press "1"
        expectFieldValueV6(input, '11/DD/YYYY');

        fireEvent.change(input, { target: { value: '11/2/YYYY' } }); // Press "2"
        fireEvent.change(input, { target: { value: '11/5/YYYY' } }); // Press "5"
        expectFieldValueV6(input, '11/25/YYYY');

        fireEvent.change(input, { target: { value: '11/25/2' } }); // Press "2"
        fireEvent.change(input, { target: { value: '11/25/0' } }); // Press "0"
        fireEvent.change(input, { target: { value: '11/25/0' } }); // Press "0"
        fireEvent.change(input, { target: { value: '11/25/9' } }); // Press "9"
        expectFieldValueV6(input, '11/25/2009');
        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2009, 10, 25, 3, 3, 3));
      });

      it('should not loose date information when using the year format and value is provided', () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: adapter.formats.year,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV7,
        });

        view.selectSection('year');
        fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowDown' });

        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();

        view = renderWithProps({
          format: adapter.formats.year,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV6,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('year');
        fireUserEvent.keyPress(input, { key: 'ArrowDown' });

        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
      });

      it('should not loose date information when using the month format and value is provided', () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: adapter.formats.month,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV7,
        });

        view.selectSection('month');
        fireUserEvent.keyPress(view.getActiveSection(0), { key: 'ArrowDown' });
        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2010, 2, 3, 3, 3, 3));

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();

        view = renderWithProps({
          format: adapter.formats.month,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV6,
          enableAccessibleFieldDOMStructure: false,
        });

        view.selectSection('month');
        const input = getTextbox();
        fireUserEvent.keyPress(input, { key: 'ArrowDown' });
        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2010, 2, 3, 3, 3, 3));
      });
    },
  );

  describeAdapters(
    'Imperative change (without any section selected)',
    DateField,
    ({ adapter, renderWithProps }) => {
      it('should set the date when the change value is valid and no value is provided', () => {
        // Test with v7 input
        const onChangeV7 = spy();
        const view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          onChange: onChangeV7,
        });
        fireEvent.change(view.getHiddenInput(), { target: { value: '09/16/2022' } });

        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();
        renderWithProps({
          onChange: onChangeV6,
          enableAccessibleFieldDOMStructure: false,
        });
        const input = getTextbox();
        fireEvent.change(input, { target: { value: '09/16/2022' } });

        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
      });

      it('should set the date when the change value is valid and a value is provided', () => {
        // Test with v7 input
        const onChangeV7 = spy();

        const view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV7,
        });

        fireEvent.change(view.getHiddenInput(), { target: { value: '09/16/2022' } });

        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16, 3, 3, 3));

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();

        renderWithProps({
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV6,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        fireEvent.change(input, { target: { value: '09/16/2022' } });

        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16, 3, 3, 3));
      });
    },
  );

  describeAdapters(
    'Android editing (<input /> textfield DOM structure only)',
    DateField,
    ({ adapter, renderWithProps }) => {
      let originalUserAgent: string = '';

      beforeEach(() => {
        originalUserAgent = global.navigator.userAgent;
        Object.defineProperty(global.navigator, 'userAgent', {
          configurable: true,
          writable: true,
          value:
            'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36',
        });
      });

      afterEach(() => {
        Object.defineProperty(global.navigator, 'userAgent', {
          configurable: true,
          value: originalUserAgent,
        });
      });

      it('should support digit editing', () => {
        const view = renderWithProps({
          defaultValue: adapter.date('2022-11-23'),
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        const initialValueStr = input.value;

        view.selectSection('day');

        // Remove the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('23', '') } });

        // Set the key pressed in the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('23', '2') } });

        // Remove the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('23', '') } });

        // Set the key pressed in the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('23', '1') } });

        expectFieldValueV6(input, '11/01/2022');
      });

      it('should support letter editing', () => {
        // Test with v6 input
        const view = renderWithProps({
          defaultValue: adapter.date('2022-01-16'),
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');

        // Remove the selected section
        fireEvent.change(input, { target: { value: ' 2022' } });

        // Set the key pressed in the selected section
        fireEvent.change(input, { target: { value: 'J 2022' } });

        // Remove the selected section
        fireEvent.change(input, { target: { value: ' 2022' } });

        // Set the key pressed in the selected section
        fireEvent.change(input, { target: { value: 'a 2022' } });

        expectFieldValueV6(input, 'April 2022');
      });
    },
  );

  describeAdapters('Editing from the outside', DateField, ({ adapter, renderWithProps, clock }) => {
    it('should be able to reset the value from the outside', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        value: adapter.date('2022-11-23'),
      });
      expectFieldValueV7(view.getSectionsContainer(), '11/23/2022');

      view.setProps({ value: null });

      view.selectSection('month');
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        value: adapter.date('2022-11-23'),
        enableAccessibleFieldDOMStructure: false,
      });
      const input = getTextbox();
      expectFieldValueV6(input, '11/23/2022');

      view.setProps({ value: null });

      view.selectSection('month');
      expectFieldValueV6(input, 'MM/DD/YYYY');
    });

    it('should reset the input query state on an unfocused field', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true, value: null });

      view.selectSection('month');

      view.pressKey(0, '1');
      expectFieldValueV7(view.getSectionsContainer(), '01/DD/YYYY');

      view.pressKey(0, '1');
      expectFieldValueV7(view.getSectionsContainer(), '11/DD/YYYY');

      view.pressKey(1, '2');
      view.pressKey(1, '5');
      expectFieldValueV7(view.getSectionsContainer(), '11/25/YYYY');

      view.pressKey(2, '2');
      view.pressKey(2, '0');
      expectFieldValueV7(view.getSectionsContainer(), '11/25/0020');

      act(() => {
        view.getSectionsContainer().blur();
      });

      clock.runToLast();

      view.setProps({ value: adapter.date('2022-11-23') });
      expectFieldValueV7(view.getSectionsContainer(), '11/23/2022');

      view.selectSection('year');

      view.pressKey(2, '2');
      expectFieldValueV7(view.getSectionsContainer(), '11/23/0002');
      view.pressKey(2, '1');
      expectFieldValueV7(view.getSectionsContainer(), '11/23/0021');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false, value: null });

      const input = getTextbox();
      view.selectSection('month');

      fireEvent.change(input, { target: { value: '1/DD/YYYY' } }); // Press "1"
      expectFieldValueV6(input, '01/DD/YYYY');

      fireEvent.change(input, { target: { value: '11/DD/YYYY' } }); // Press "1"
      expectFieldValueV6(input, '11/DD/YYYY');

      fireEvent.change(input, { target: { value: '11/2/YYYY' } }); // Press "2"
      fireEvent.change(input, { target: { value: '11/5/YYYY' } }); // Press "5"
      expectFieldValueV6(input, '11/25/YYYY');

      fireEvent.change(input, { target: { value: '11/25/2' } }); // Press "2"
      fireEvent.change(input, { target: { value: '11/25/0' } }); // Press "0"
      expectFieldValueV6(input, '11/25/0020');

      act(() => {
        input.blur();
      });

      view.setProps({ value: adapter.date('2022-11-23') });
      expectFieldValueV6(input, '11/23/2022');

      fireEvent.mouseDown(input);
      fireEvent.mouseUp(input);
      act(() => {
        input.setSelectionRange(6, 9);
      });
      fireEvent.click(input);

      fireEvent.change(input, { target: { value: '11/23/2' } }); // Press "2"
      expectFieldValueV6(input, '11/23/0002');
      fireEvent.change(input, { target: { value: '11/23/1' } }); // Press "0"
      expectFieldValueV6(input, '11/23/0021');
    });
  });

  describeAdapters('Select all', DateField, ({ renderWithProps }) => {
    it('should edit the 1st section when all sections are selected', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      // When all sections are selected, the value only contains the key pressed
      view.pressKey(null, '9');

      expectFieldValueV7(view.getSectionsContainer(), '09/DD/YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      view.selectSection('month');
      const input = getTextbox();

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', ctrlKey: true });

      // When all sections are selected, the value only contains the key pressed
      fireEvent.change(input, { target: { value: '9' } });

      expectFieldValueV6(input, '09/DD/YYYY');
    });
  });
});

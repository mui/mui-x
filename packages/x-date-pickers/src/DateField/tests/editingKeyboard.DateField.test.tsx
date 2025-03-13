import { expect } from 'chai';
import { spy } from 'sinon';
import { DateField } from '@mui/x-date-pickers/DateField';
import { fireEvent } from '@mui/internal-test-utils';
import {
  expectFieldValueV7,
  getTextbox,
  describeAdapters,
  expectFieldValueV6,
} from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<DateField /> - Editing Keyboard', () => {
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
      // Test with accessible DOM structure
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

      // Test with non-accessible DOM structure
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
      // Test with accessible DOM structure
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date(),
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      fireUserEvent.keyPress(view.getSectionsContainer(), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: adapter.date(),
      });

      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expectFieldValueV6(input, 'MMMM YYYY');
    });

    it('should clear all the sections when all sections are selected and not all sections are completed', () => {
      // Test with accessible DOM structure
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      view.selectSection('month');

      // Set a value for the "month" section
      view.pressKey(0, 'j');
      expectFieldValueV7(view.getSectionsContainer(), 'January YYYY');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      fireUserEvent.keyPress(view.getSectionsContainer(), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
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
      fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expectFieldValueV6(input, 'MMMM YYYY');
    });

    it('should not keep query after typing again on a cleared section', () => {
      // Test with accessible DOM structure
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

      // Test with non-accessible DOM structure
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
      // Test with accessible DOM structure
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        onChange: onChangeV7,
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      fireUserEvent.keyPress(view.getSectionsContainer(), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(0);

      view.unmount();

      // Test with non-accessible DOM structure
      const onChangeV6 = spy();

      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        onChange: onChangeV6,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(0);
    });

    it('should call `onChange` when clearing the first section', () => {
      // Test with accessible DOM structure
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
      expect(onChangeV7.lastCall.firstArg).to.equal(null);

      fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });

      fireUserEvent.keyPress(view.getActiveSection(1), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);

      view.unmount();

      // Test with non-accessible DOM structure
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
      expect(onChangeV6.lastCall.firstArg).to.equal(null);

      fireUserEvent.keyPress(input, { key: 'ArrowRight' });

      fireUserEvent.keyPress(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(1);
    });

    it('should not call `onChange` if the section is already empty', () => {
      // Test with accessible DOM structure
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

      // Test with non-accessible DOM structure
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
});

import { expect } from 'chai';
import { spy } from 'sinon';
import { DateField } from '@mui/x-date-pickers/DateField';
import { act, fireEvent, waitFor } from '@mui/internal-test-utils';
import {
  expectFieldValueV7,
  getTextbox,
  describeAdapters,
  expectFieldValueV6,
  getCleanedSelectedContent,
} from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import { testSkipIf } from 'test/utils/skipIf';

describe('<DateField /> - Editing', () => {
  describeAdapters(
    'value props (value, defaultValue, onChange)',
    DateField,
    ({ adapter, renderWithProps }) => {
      it('should call the onChange callback when the value is updated but should not change the displayed value if the value is controlled', () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: adapter.date('2022-06-04'),
          onChange: onChangeV7,
        });

        view.selectSection('year');

        view.pressKey(2, 'ArrowUp');
        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022');

        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2023, 5, 4));

        view.unmount();

        // Test with non-accessible DOM structure
        const onChangeV6 = spy();
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          value: adapter.date('2022-06-04'),
          onChange: onChangeV6,
        });

        view.selectSection('year');
        const input = getTextbox();
        fireUserEvent.keyPress(input, { key: 'ArrowUp' });
        expectFieldValueV6(getTextbox(), '06/04/2022');

        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2023, 5, 4));
      });

      it('should call the onChange callback when the value is updated and should change the displayed value if the value is not controlled', () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: adapter.date('2022-06-04'),
          onChange: onChangeV7,
        });

        view.selectSection('year');

        view.pressKey(2, 'ArrowUp');
        expectFieldValueV7(view.getSectionsContainer(), '06/04/2023');

        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2023, 5, 4));

        view.unmount();

        // Test with non-accessible DOM structure
        const onChangeV6 = spy();
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          defaultValue: adapter.date('2022-06-04'),
          onChange: onChangeV6,
        });

        view.selectSection('year');
        fireUserEvent.keyPress(getTextbox(), { key: 'ArrowUp' });
        expectFieldValueV6(getTextbox(), '06/04/2023');

        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2023, 5, 4));
      });

      it('should not call the onChange callback before filling the last section when starting from a null value', async () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: null,
          onChange: onChangeV7,
          format: `${adapter.formats.dayOfMonth} ${adapter.formats.monthShort}`,
        });

        view.selectSection('day');

        view.pressKey(0, '4');
        expect(onChangeV7.callCount).to.equal(0);
        expectFieldValueV7(view.getSectionsContainer(), '04 MMMM');

        view.pressKey(1, 'S');
        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 4));
        await waitFor(() => {
          expectFieldValueV7(view.getSectionsContainer(), 'DD MMMM');
        });

        view.unmount();

        // Test with non-accessible DOM structure
        const onChangeV6 = spy();
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          value: null,
          onChange: onChangeV6,
          format: `${adapter.formats.dayOfMonth} ${adapter.formats.monthShort}`,
        });

        view.selectSection('day');
        const input = getTextbox();

        fireEvent.change(input, { target: { value: '4 MMMM' } }); // Press 4
        expect(onChangeV6.callCount).to.equal(0);
        expectFieldValueV6(input, '04 MMMM');

        fireEvent.change(input, { target: { value: '04 S' } }); // Press S
        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 4));
        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
        await waitFor(() => {
          expectFieldValueV6(input, 'DD MMMM');
        });
      });
    },
  );

  describeAdapters('Disabled field', DateField, ({ renderWithProps }) => {
    it('should not allow key editing on disabled field', () => {
      // Test with accessible DOM structure
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

      // Test with non-accessible DOM structure
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

    // Luxon doesn't have any day format with a letter suffix
    testSkipIf(adapter.lib === 'luxon')('should support day with letter suffix', () => {
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
      // Test with accessible DOM structure
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

      // Test with non-accessible DOM structure
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

    it('should reset the select "all" state when typing a digit', () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      view.selectSection('month');
      // select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      view.pressKey(null, '1');
      expect(getCleanedSelectedContent()).to.equal('01');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      view.selectSection('month');
      const input = getTextbox();
      // select all sections
      fireEvent.keyDown(input, {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.change(input, { target: { value: '1/DD/YYYY' } });
      expect(getCleanedSelectedContent()).to.equal('01');
    });
  });

  describeAdapters(
    'Letter editing',
    DateField,
    ({ adapter, testFieldChange, testFieldKeyPress, renderWithProps }) => {
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

      it('should reset the select "all" state when typing a letter', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

        view.selectSection('month');
        // select all sections
        fireEvent.keyDown(view.getActiveSection(0), {
          key: 'a',
          keyCode: 65,
          ctrlKey: true,
        });
        expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

        view.pressKey(null, 'j');
        expect(getCleanedSelectedContent()).to.equal(adapter.lib === 'luxon' ? '1' : '01');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

        view.selectSection('month');
        const input = getTextbox();
        // select all sections
        fireEvent.keyDown(input, {
          key: 'a',
          keyCode: 65,
          ctrlKey: true,
        });
        expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

        fireEvent.change(input, { target: { value: 'j/DD/YYYY' } });
        expect(getCleanedSelectedContent()).to.equal(adapter.lib === 'luxon' ? '1' : '01');
      });
    },
  );

  describeAdapters(
    `Backspace editing`,
    DateField,
    ({ adapter, renderWithProps, testFieldChange }) => {
      it('should clear the selected section when only this section is completed (Backspace)', () => {
        // Test with accessible DOM structure
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

        // Test with non-accessible DOM structure
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
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: adapter.date(),
        });

        view.selectSection('month');

        view.pressKey(0, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM 2022');

        view.unmount();

        // Test with non-accessible DOM structure
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

        view.pressKey(null, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: adapter.date(),
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });

        fireEvent.change(input, { target: { value: '' } });
        expectFieldValueV6(input, 'MMMM YYYY');
      });

      it('should clear all the sections when all sections are selected and not all sections are completed (Backspace)', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        view.selectSection('month');
        view.pressKey(0, 'j');
        expectFieldValueV7(view.getSectionsContainer(), 'January YYYY');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), {
          key: 'a',
          keyCode: 65,
          ctrlKey: true,
        });

        view.pressKey(null, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');
        fireEvent.change(input, { target: { value: 'j YYYY' } });
        expectFieldValueV6(input, 'January YYYY');

        // Select all sections
        fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });

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

      it('should call `onChange` when clearing the first section (Backspace)', () => {
        // Test with accessible DOM structure
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
        expect(onChangeV7.lastCall.firstArg).to.equal(null);

        view.selectSection('year');
        view.pressKey(1, '');
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
        fireEvent.change(input, { target: { value: ' 2022' } });
        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg).to.equal(null);

        fireUserEvent.keyPress(input, { key: 'ArrowRight' });

        fireEvent.change(input, { target: { value: 'MMMM ' } });
        expect(onChangeV6.callCount).to.equal(1);
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
      // Test with accessible DOM structure
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date(),
        onChange: onChangeV7,
      });
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      firePasteEventV7(view.getSectionsContainer(), '09/16/2022');

      expect(onChangeV7.callCount).to.equal(1);
      expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));

      view.unmount();

      // Test with non-accessible DOM structure
      const onChangeV6 = spy();
      view = renderWithProps({
        defaultValue: adapter.date(),
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
      });
      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });

      firePasteEventV6(input, '09/16/2022');

      expect(onChangeV6.callCount).to.equal(1);
      expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
    });

    it('should set the date when all sections are selected, the pasted value is valid and no value is provided', () => {
      // Test with accessible DOM structure
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
      });
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      firePasteEventV7(view.getSectionsContainer(), '09/16/2022');

      expect(onChangeV7.callCount).to.equal(1);
      expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
      view.unmount();

      // Test with non-accessible DOM structure
      const onChangeV6 = spy();
      view = renderWithProps({
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
      });
      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });

      firePasteEventV6(input, '09/16/2022');

      expect(onChangeV6.callCount).to.equal(1);
      expect(onChangeV6.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
    });

    it('should not set the date when all sections are selected and the pasted value is not valid', () => {
      // Test with accessible DOM structure
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
      });
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      firePasteEventV7(view.getSectionsContainer(), 'Some invalid content');
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      view.unmount();

      // Test with non-accessible DOM structure
      const onChangeV6 = spy();
      view = renderWithProps({
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
      });
      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });

      firePasteEventV6(input, 'Some invalid content');
      expectFieldValueV6(input, 'MM/DD/YYYY');
    });

    it('should set the date when all sections are selected and the format contains escaped characters', () => {
      const { start: startChar, end: endChar } = adapter.escapedCharacters;

      // Test with accessible DOM structure
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
        format: `${startChar}Escaped${endChar} ${adapter.formats.year}`,
      });

      view.selectSection('year');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      firePasteEventV7(view.getSectionsContainer(), `Escaped 2014`);
      expect(onChangeV7.callCount).to.equal(1);
      expect(adapter.getYear(onChangeV7.lastCall.firstArg)).to.equal(2014);
      view.unmount();

      // Test with non-accessible DOM structure
      const onChangeV6 = spy();
      view = renderWithProps({
        onChange: onChangeV6,
        format: `${startChar}Escaped${endChar} ${adapter.formats.year}`,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('year');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });

      firePasteEventV6(input, `Escaped 2014`);
      expect(onChangeV6.callCount).to.equal(1);
      expect(adapter.getYear(onChangeV6.lastCall.firstArg)).to.equal(2014);
    });

    it('should not set the date when all sections are selected and props.readOnly = true', () => {
      // Test with accessible DOM structure
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
        readOnly: true,
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      firePasteEventV7(view.getSectionsContainer(), '09/16/2022');
      expect(onChangeV7.callCount).to.equal(0);

      view.unmount();

      // Test with non-accessible DOM structure
      const onChangeV6 = spy();

      view = renderWithProps({
        onChange: onChangeV6,
        readOnly: true,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });

      firePasteEventV6(input, '09/16/2022');
      expect(onChangeV6.callCount).to.equal(0);
    });

    it('should set the section when one section is selected, the pasted value has the correct type and no value is provided', () => {
      // Test with accessible DOM structure
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
      });

      view.selectSection('month');

      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      firePasteEventV7(view.getActiveSection(0), '12');

      expect(onChangeV7.callCount).to.equal(0);
      expectFieldValueV7(view.getSectionsContainer(), '12/DD/YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
      const onChangeV6 = spy();

      view = renderWithProps({
        onChange: onChangeV6,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('month');

      expectFieldValueV6(input, 'MM/DD/YYYY');
      firePasteEventV6(input, '12');

      expect(onChangeV6.callCount).to.equal(0);
      expectFieldValueV6(input, '12/DD/YYYY');
    });

    it('should set the section when one section is selected, the pasted value has the correct type and value is provided', () => {
      // Test with accessible DOM structure
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

      // Test with non-accessible DOM structure
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
      // Test with accessible DOM structure
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

      // Test with non-accessible DOM structure
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
      // Test with accessible DOM structure
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date('2018-12-05'),
      });

      view.selectSection('day');

      view.pressKey(1, '2');
      expectFieldValueV7(view.getSectionsContainer(), '12/02/2018');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(1), { key: 'a', keyCode: 65, ctrlKey: true });

      firePasteEventV7(view.getSectionsContainer(), '09/16/2022');
      expectFieldValueV7(view.getSectionsContainer(), '09/16/2022');

      view.selectSection('day');

      view.pressKey(1, '2'); // Press 2
      expectFieldValueV7(view.getSectionsContainer(), '09/02/2022'); // If internal state is not reset it would be 22 instead of 02

      view.unmount();

      // Test with non-accessible DOM structure
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
      // Test with accessible DOM structure
      const onChangeV7 = spy();
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange: onChangeV7,
        disabled: true,
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      firePasteEventV7(view.getSectionsContainer(), '09/16/2022');
      expect(onChangeV7.callCount).to.equal(0);
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
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
        // Test with accessible DOM structure
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

        // Test with non-accessible DOM structure
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
        // Test with accessible DOM structure
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV7,
        });

        view.selectSection('month');
        fireEvent.keyDown(view.getActiveSection(0), {
          key: 'a',
          keyCode: 65,
          ctrlKey: true,
        });
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

        // Test with non-accessible DOM structure
        const onChangeV6 = spy();

        view = renderWithProps({
          defaultValue: adapter.date('2010-04-03T03:03:03'),
          onChange: onChangeV6,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');
        fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });
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
        // Test with accessible DOM structure
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

        // Test with non-accessible DOM structure
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
        // Test with accessible DOM structure
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

        // Test with non-accessible DOM structure
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
        // Test with accessible DOM structure
        const onChangeV7 = spy();
        const view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          onChange: onChangeV7,
        });
        fireEvent.change(view.getHiddenInput(), { target: { value: '09/16/2022' } });

        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));

        view.unmount();

        // Test with non-accessible DOM structure
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
        // Test with accessible DOM structure
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

        // Test with non-accessible DOM structure
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
        originalUserAgent = globalThis.navigator.userAgent;
        Object.defineProperty(globalThis.navigator, 'userAgent', {
          configurable: true,
          writable: true,
          value:
            'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36',
        });
      });

      afterEach(() => {
        Object.defineProperty(globalThis.navigator, 'userAgent', {
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
        // Test with non-accessible DOM structure
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

  describeAdapters('Editing from the outside', DateField, ({ adapter, renderWithProps }) => {
    it('should be able to reset the value from the outside', () => {
      // Test with accessible DOM structure
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        value: adapter.date('2022-11-23'),
      });
      expectFieldValueV7(view.getSectionsContainer(), '11/23/2022');

      view.setProps({ value: null });

      view.selectSection('month');
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
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
      if (adapter.lib !== 'dayjs') {
        return;
      }
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true, value: null });

      view.selectSection('month');

      view.pressKey(0, '1');
      expectFieldValueV7(view.getSectionsContainer(), '01/DD/YYYY');

      view.pressKey(0, '1');
      expectFieldValueV7(view.getSectionsContainer(), '11/DD/YYYY');

      view.pressKey(1, '1');
      expectFieldValueV7(view.getSectionsContainer(), '11/01/YYYY');

      act(() => {
        view.getSectionsContainer().blur();
      });

      view.setProps({ value: adapter.date('2022-11-23') });
      view.setProps({ value: null });

      view.selectSection('month');

      view.pressKey(0, '1');
      expectFieldValueV7(view.getSectionsContainer(), '01/DD/YYYY');

      view.pressKey(0, '1');
      expectFieldValueV7(view.getSectionsContainer(), '11/DD/YYYY');

      view.pressKey(1, '1');
      expectFieldValueV7(view.getSectionsContainer(), '11/01/YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false, value: null });

      const input = getTextbox();
      view.selectSection('month');

      fireEvent.change(input, { target: { value: '1/DD/YYYY' } }); // Press "1"
      expectFieldValueV6(input, '01/DD/YYYY');

      fireEvent.change(input, { target: { value: '11/DD/YYYY' } }); // Press "1"
      expectFieldValueV6(input, '11/DD/YYYY');

      fireEvent.change(input, { target: { value: '11/1/YYYY' } }); // Press "1"
      expectFieldValueV6(input, '11/01/YYYY');

      act(() => {
        input.blur();
      });

      view.setProps({ value: adapter.date('2022-11-23') });
      view.setProps({ value: null });

      view.selectSection('month');

      fireEvent.change(input, { target: { value: '1/DD/YYYY' } }); // Press "1"
      expectFieldValueV6(input, '01/DD/YYYY');

      fireEvent.change(input, { target: { value: '11/DD/YYYY' } }); // Press "1"
      expectFieldValueV6(input, '11/DD/YYYY');

      fireEvent.change(input, { target: { value: '11/1/YYYY' } }); // Press "1"
      expectFieldValueV6(input, '11/01/YYYY');
    });
  });

  describeAdapters('Select all', DateField, ({ renderWithProps }) => {
    it('should edit the 1st section when all sections are selected', () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      // When all sections are selected, the value only contains the key pressed
      view.pressKey(null, '9');

      expectFieldValueV7(view.getSectionsContainer(), '09/DD/YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      view.selectSection('month');
      const input = getTextbox();

      // Select all sections
      fireUserEvent.keyPress(input, { key: 'a', keyCode: 65, ctrlKey: true });

      // When all sections are selected, the value only contains the key pressed
      fireEvent.change(input, { target: { value: '9' } });

      expectFieldValueV6(input, '09/DD/YYYY');
    });
  });
});

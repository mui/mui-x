import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { DateField } from '@mui/x-date-pickers/DateField';
import { act, userEvent, fireEvent } from '@mui/monorepo/test/utils';
import { expectInputValue, getTextbox } from 'test/utils/pickers-utils';
import { describeAdapters } from '@mui/x-date-pickers/tests/describeAdapters';

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
        format: adapter.formats.monthAndYear,
        defaultValue: adapter.date(new Date(2022, 0, 15)),
        key: 'ArrowDown',
        expectedValue: 'December 2022',
      });
    });

    it("should set the day to the last day of today's month when no value is provided", () => {
      testFieldKeyPress({
        format: adapter.formats.dayOfMonth,
        key: 'ArrowDown',
        expectedValue: '30',
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

    it('should go to the last day of the current month when a value in the first day of the month is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.monthAndDate,
        defaultValue: adapter.date(new Date(2022, 5, 1)),
        key: 'ArrowDown',
        expectedValue: 'June 30',
        // To select the date and not the month
        valueToSelect: '1',
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
        format: adapter.formats.monthAndYear,
        defaultValue: adapter.date(new Date(2022, 11, 15)),
        key: 'ArrowUp',
        expectedValue: 'January 2022',
      });
    });

    it('should set the day 1 when no value is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.dayOfMonth,
        key: 'ArrowUp',
        expectedValue: '1',
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

    it('should go to the first day of the current month when a value in the last day of the month is provided', () => {
      testFieldKeyPress({
        format: adapter.formats.monthAndDate,
        defaultValue: adapter.date(new Date(2022, 5, 30)),
        key: 'ArrowUp',
        expectedValue: 'June 1',
        // To select the date and not the month
        valueToSelect: '30',
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

  ['Backspace', 'Delete'].forEach((keyToClearValue) => {
    describeAdapters(
      `key: ${keyToClearValue}`,
      DateField,
      ({ render, adapter, adapterName, clickOnInput, testFieldKeyPress, selectSection }) => {
        it('should clear the selected section when only this section is completed', () => {
          render(<DateField format={adapter.formats.monthAndYear} />);
          const input = getTextbox();
          clickOnInput(input, 1);

          // Set a value for the "month" section
          fireEvent.change(input, {
            target: { value: 'j YYYY' },
          }); // press "j"
          expectInputValue(input, 'January YYYY');

          userEvent.keyPress(input, { key: keyToClearValue });
          expectInputValue(input, 'MMMM YYYY');
        });

        it('should clear the selected section when all sections are completed', () => {
          testFieldKeyPress({
            format: adapter.formats.monthAndYear,
            defaultValue: adapter.date(),
            key: keyToClearValue,
            expectedValue: 'MMMM 2022',
          });
        });

        it('should clear all the sections when all sections are selected and all sections are completed', () => {
          render(<DateField format={adapter.formats.monthAndYear} defaultValue={adapter.date()} />);
          const input = getTextbox();
          clickOnInput(input, 1);

          // Select all sections
          userEvent.keyPress(input, { key: 'a', ctrlKey: true });

          userEvent.keyPress(input, { key: keyToClearValue });
          expectInputValue(input, 'MMMM YYYY');
        });

        it('should clear all the sections when all sections are selected and not all sections are completed', () => {
          render(<DateField format={adapter.formats.monthAndYear} />);
          const input = getTextbox();
          clickOnInput(input, 1);

          // Set a value for the "month" section
          fireEvent.change(input, {
            target: { value: 'j YYYY' },
          }); // Press "j"
          expectInputValue(input, 'January YYYY');

          // Select all sections
          userEvent.keyPress(input, { key: 'a', ctrlKey: true });

          userEvent.keyPress(input, { key: keyToClearValue });
          expectInputValue(input, 'MMMM YYYY');
        });

        it('should not keep query after typing again on a cleared section', () => {
          render(<DateField format={adapter.formats.year} />);
          const input = getTextbox();
          clickOnInput(input, 1);

          fireEvent.change(input, { target: { value: '2' } }); // press "2"
          expectInputValue(input, adapterName === 'dayjs' ? '2' : '0002');

          userEvent.keyPress(input, { key: keyToClearValue });
          expectInputValue(input, 'YYYY');

          fireEvent.change(input, { target: { value: '2' } }); // press "2"
          expectInputValue(input, adapterName === 'dayjs' ? '2' : '0002');
        });

        it('should not clear the sections when props.readOnly = true', () => {
          testFieldKeyPress({
            format: adapter.formats.year,
            defaultValue: adapter.date(),
            readOnly: true,
            key: keyToClearValue,
            expectedValue: '2022',
          });
        });

        it('should not call `onChange` when clearing all sections and both dates are already empty', () => {
          const handleChange = spy();

          render(
            <DateField
              format={adapter.formats.monthAndYear}
              defaultValue={null}
              onChange={handleChange}
            />,
          );

          const input = getTextbox();
          clickOnInput(input, 1);

          // Select all sections
          userEvent.keyPress(input, { key: 'a', ctrlKey: true });

          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(0);
        });

        it('should call `onChange` when clearing the first and last section', () => {
          const handleChange = spy();

          render(
            <DateField
              format={adapter.formats.monthAndYear}
              defaultValue={adapter.date()}
              onChange={handleChange}
            />,
          );

          const input = getTextbox();
          selectSection(input, 0);

          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(1);
          expect(handleChange.lastCall.args[1].validationError).to.equal('invalidDate');

          userEvent.keyPress(input, { key: 'ArrowRight' });

          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(2);
          expect(handleChange.lastCall.firstArg).to.equal(null);
          expect(handleChange.lastCall.args[1].validationError).to.equal(null);
        });

        it('should not call `onChange` if the section is already empty', () => {
          const handleChange = spy();

          render(
            <DateField
              format={adapter.formats.monthAndYear}
              defaultValue={adapter.date()}
              onChange={handleChange}
            />,
          );

          const input = getTextbox();
          selectSection(input, 0);

          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(1);

          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(1);
        });
      },
    );
  });

  describeAdapters('Digit editing', DateField, ({ adapter, adapterName, testFieldChange }) => {
    it('should set the day to the digit pressed when no digit no value is provided', () => {
      testFieldChange({
        format: adapter.formats.dayOfMonth,
        keyStrokes: [{ value: '1', expected: '1' }],
      });
    });

    it('should concatenate the digit pressed to the current section value if the output is valid (digit format)', () => {
      testFieldChange({
        format: adapter.formats.dayOfMonth,
        defaultValue: adapter.date(new Date(2022, 5, 0)),
        keyStrokes: [
          { value: '1', expected: '1' },
          { value: '1', expected: '11' },
        ],
      });
    });

    it('should set the day to the digit pressed if the concatenated value exceeds the maximum value for the section when a value is provided (digit format)', () => {
      testFieldChange({
        format: adapter.formats.dayOfMonth,
        defaultValue: adapter.date(new Date(2022, 5, 4)),
        keyStrokes: [{ value: '1', expected: '1' }],
      });
    });

    it('should concatenate the digit pressed to the current section value if the output is valid (letter format)', () => {
      testFieldChange({
        format: adapter.formats.month,
        defaultValue: adapter.date(new Date(2022, 1, 0)),
        keyStrokes: [
          { value: '1', expected: 'January' },
          { value: '1', expected: 'November' },
        ],
      });
    });

    it('should set the day to the digit pressed if the concatenated value exceeds the maximum value for the section when a value is provided (letter format)', () => {
      testFieldChange({
        format: adapter.formats.month,
        defaultValue: adapter.date(new Date(2022, 5, 0)),
        keyStrokes: [{ value: '1', expected: 'January' }],
      });
    });

    it('should support 2-digits year format', () => {
      testFieldChange({
        // This format is not present in any of the adapter formats
        format: adapterName.includes('moment') || adapterName.includes('dayjs') ? 'YY' : 'yy',
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
        format: adapterName.includes('moment') || adapterName.includes('dayjs') ? 'YY' : 'yy',
        defaultValue: adapter.date(new Date(2022, 5, 4)),
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
          { value: '2', expected: adapterName === 'dayjs' ? '2' : '0002' },
          { value: '0', expected: adapterName === 'dayjs' ? '20' : '0020' },
          { value: '2', expected: adapterName === 'dayjs' ? '202' : '0202' },
          { value: '2', expected: '2022' },
          { value: '2', expected: adapterName === 'dayjs' ? '2' : '0002' },
          { value: '0', expected: adapterName === 'dayjs' ? '20' : '0020' },
          { value: '2', expected: adapterName === 'dayjs' ? '202' : '0202' },
          { value: '3', expected: '2023' },
        ],
      });
    });

    it('should support 4-digits year format when a value is provided', () => {
      testFieldChange({
        format: adapter.formats.year,
        defaultValue: adapter.date(new Date(2022, 5, 4)),
        keyStrokes: [
          { value: '2', expected: adapterName === 'dayjs' ? '2' : '0002' },
          { value: '0', expected: adapterName === 'dayjs' ? '20' : '0020' },
          { value: '2', expected: adapterName === 'dayjs' ? '202' : '0202' },
          { value: '2', expected: '2022' },
          { value: '2', expected: adapterName === 'dayjs' ? '2' : '0002' },
          { value: '0', expected: adapterName === 'dayjs' ? '20' : '0020' },
          { value: '2', expected: adapterName === 'dayjs' ? '202' : '0202' },
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
      });
    });

    it('should support day with letter suffix', function test() {
      // Luxon don't have any day format with a letter suffix
      if (adapterName === 'luxon') {
        this.skip();
      }

      testFieldChange({
        format: adapterName === 'date-fns' ? 'do' : 'Do',
        keyStrokes: [
          { value: '1', expected: '1st' },
          { value: '2', expected: '12th' },
          { value: '2', expected: '2nd' },
        ],
      });
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

  describeAdapters('Full editing scenarios', DateField, ({ adapterName, render, clickOnInput }) => {
    it('should move to the last day of the month when the current day exceeds it', () => {
      const onChange = spy();

      render(<DateField onChange={onChange} />);
      const input = getTextbox();
      clickOnInput(input, 1);

      fireEvent.change(input, { target: { value: '1/DD/YYYY' } }); // Press "1"
      expectInputValue(input, adapterName === 'luxon' ? '1/DD/YYYY' : '01/DD/YYYY');

      fireEvent.change(input, { target: { value: '1/DD/YYYY' } }); // Press "1"
      expectInputValue(input, '11/DD/YYYY');

      fireEvent.change(input, { target: { value: '11/3/YYYY' } }); // Press "3"
      expectInputValue(input, adapterName === 'luxon' ? '11/3/YYYY' : '11/03/YYYY');

      fireEvent.change(input, { target: { value: '11/31/YYYY' } }); // Press "1"
      expectInputValue(input, '11/31/YYYY');

      // TODO: Fix this behavior on day.js (`clampDaySection` generates an invalid date for the start of the month).
      if (adapterName === 'dayjs') {
        return;
      }

      fireEvent.change(input, { target: { value: '11/31/2' } }); // Press "2"
      expectInputValue(input, '11/30/0002'); // Has moved to the last day of the November

      fireEvent.change(input, { target: { value: '11/30/0' } }); // Press "0"
      expectInputValue(input, '11/30/0020');

      fireEvent.change(input, { target: { value: '11/30/2' } }); // Press "2"
      expectInputValue(input, '11/30/0202');

      fireEvent.change(input, { target: { value: '11/30/2' } }); // Press "2"
      expectInputValue(input, '11/30/2022');
    });
  });

  describeAdapters('Pasting', DateField, ({ adapter, adapterName, render, clickOnInput }) => {
    const firePasteEvent = (input: HTMLInputElement, pastedValue: string) => {
      act(() => {
        const clipboardEvent = new Event('paste', {
          bubbles: true,
          cancelable: true,
          composed: true,
        });

        // @ts-ignore
        clipboardEvent.clipboardData = {
          getData: () => pastedValue,
        };
        // canContinue is `false` if default have been prevented
        const canContinue = input.dispatchEvent(clipboardEvent);
        if (!canContinue) {
          return;
        }

        const prevValue = input.value;
        const nextValue = `${prevValue.slice(
          0,
          input.selectionStart || 0,
        )}${pastedValue}${prevValue.slice(input.selectionEnd || 0)}`;
        fireEvent.change(input, { target: { value: nextValue } });
      });
    };

    it('should set the date when all sections are selected, the pasted value is valid and a value is provided', () => {
      const onChange = spy();
      render(<DateField onChange={onChange} defaultValue={adapter.date()} />);
      const input = getTextbox();
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEvent(input, '09/16/2022');

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
    });

    it('should set the date when all sections are selected, the pasted value is valid and no value is provided', () => {
      const onChange = spy();
      render(<DateField onChange={onChange} />);
      const input = getTextbox();
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEvent(input, '09/16/2022');

      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
    });

    it('should not set the date when all sections are selected and the pasted value is not valid', () => {
      const onChange = spy();
      render(<DateField onChange={onChange} />);
      const input = getTextbox();
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEvent(input, 'Some invalid content');
      expectInputValue(input, 'MM/DD/YYYY');
    });

    it('should set the date when all sections are selected and the format contains escaped characters', () => {
      const { start: startChar, end: endChar } = adapter.escapedCharacters;
      const onChange = spy();
      render(
        <DateField
          onChange={onChange}
          format={`${startChar}Escaped${endChar} ${adapter.formats.year}`}
        />,
      );
      const input = getTextbox();
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEvent(input, `Escaped 2014`);
      expect(onChange.callCount).to.equal(1);
      expect(adapter.getYear(onChange.lastCall.firstArg)).to.equal(2014);
    });

    it('should not set the date when all sections are selected and props.readOnly = true', () => {
      const onChange = spy();
      render(<DateField onChange={onChange} readOnly />);
      const input = getTextbox();
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEvent(input, '09/16/2022');
      expect(onChange.callCount).to.equal(0);
    });

    it('should set the section when one section is selected, the pasted value has the correct type and no value is provided', () => {
      const onChange = spy();
      render(<DateField onChange={onChange} />);
      const input = getTextbox();
      clickOnInput(input, 1);

      expectInputValue(input, 'MM/DD/YYYY');
      firePasteEvent(input, '12');

      expect(onChange.callCount).to.equal(1);
      expectInputValue(input, '12/DD/YYYY');
    });

    it('should set the section when one section is selected, the pasted value has the correct type and value is provided', () => {
      const onChange = spy();
      render(<DateField onChange={onChange} defaultValue={adapter.date(new Date(2018, 0, 13))} />);
      const input = getTextbox();
      clickOnInput(input, 1);

      expectInputValue(input, adapterName === 'luxon' ? '1/13/2018' : '01/13/2018');
      firePasteEvent(input, '12');
      expectInputValue(input, '12/13/2018');
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 11, 13));
    });

    it('should not update the section when one section is selected and the pasted value has incorrect type', () => {
      const onChange = spy();
      render(<DateField onChange={onChange} defaultValue={adapter.date(new Date(2018, 0, 13))} />);
      const input = getTextbox();
      clickOnInput(input, 1);

      expectInputValue(input, adapterName === 'luxon' ? '1/13/2018' : '01/13/2018');
      firePasteEvent(input, 'Jun');
      expectInputValue(input, adapterName === 'luxon' ? '1/13/2018' : '01/13/2018');
      expect(onChange.callCount).to.equal(0);
    });
  });

  describeAdapters(
    'Do not loose missing section values ',
    DateField,
    ({ adapter, adapterName, render, clickOnInput }) => {
      it('should not loose time information when a value is provided', () => {
        const onChange = spy();

        render(
          <DateField
            defaultValue={adapter.date(new Date(2010, 3, 3, 3, 3, 3))}
            onChange={onChange}
          />,
        );
        const input = getTextbox();
        clickOnInput(input, input.value.indexOf('2010'));
        userEvent.keyPress(input, { key: 'ArrowDown' });

        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
      });

      it('should not loose time information when cleaning the date then filling it again', () => {
        const onChange = spy();

        render(
          <DateField
            defaultValue={adapter.date(new Date(2010, 3, 3, 3, 3, 3))}
            onChange={onChange}
          />,
        );
        const input = getTextbox();
        clickOnInput(input, 1);

        userEvent.keyPress(input, { key: 'a', ctrlKey: true });
        userEvent.keyPress(input, { key: 'Backspace' });
        userEvent.keyPress(input, { key: 'ArrowLeft' });

        fireEvent.change(input, { target: { value: '1/DD/YYYY' } }); // Press "1"
        expectInputValue(input, adapterName === 'luxon' ? '1/DD/YYYY' : '01/DD/YYYY');

        fireEvent.change(input, { target: { value: '11/DD/YYYY' } }); // Press "1"
        expectInputValue(input, '11/DD/YYYY');

        fireEvent.change(input, { target: { value: '11/2/YYYY' } }); // Press "2"
        fireEvent.change(input, { target: { value: '11/5/YYYY' } }); // Press "5"
        expectInputValue(input, '11/25/YYYY');

        fireEvent.change(input, { target: { value: '11/25/2' } }); // Press "2"
        fireEvent.change(input, { target: { value: '11/25/0' } }); // Press "0"
        fireEvent.change(input, { target: { value: '11/25/0' } }); // Press "0"
        fireEvent.change(input, { target: { value: '11/25/9' } }); // Press "9"
        expectInputValue(input, '11/25/2009');
        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2009, 10, 25, 3, 3, 3));
      });

      it('should not loose date information when using the year format and value is provided', () => {
        const onChange = spy();

        render(
          <DateField
            format={adapter.formats.year}
            defaultValue={adapter.date(new Date(2010, 3, 3, 3, 3, 3))}
            onChange={onChange}
          />,
        );
        const input = getTextbox();
        clickOnInput(input, 1);
        userEvent.keyPress(input, { key: 'ArrowDown' });

        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
      });

      it('should not loose date information when using the month format and value is provided', () => {
        const onChange = spy();

        render(
          <DateField
            format={adapter.formats.month}
            defaultValue={adapter.date(new Date(2010, 3, 3, 3, 3, 3))}
            onChange={onChange}
          />,
        );
        const input = getTextbox();
        clickOnInput(input, 1);
        userEvent.keyPress(input, { key: 'ArrowDown' });

        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2010, 2, 3, 3, 3, 3));
      });
    },
  );

  describeAdapters(
    'Imperative change (without any section selected)',
    DateField,
    ({ adapter, render }) => {
      it('should set the date when the change value is valid and no value is provided', () => {
        const onChange = spy();
        render(<DateField onChange={onChange} />);
        const input = getTextbox();
        fireEvent.change(input, { target: { value: '09/16/2022' } });

        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
      });

      it('should set the date when the change value is valid and a value is provided', () => {
        const onChange = spy();
        render(
          <DateField
            defaultValue={adapter.date(new Date(2010, 3, 3, 3, 3, 3))}
            onChange={onChange}
          />,
        );
        const input = getTextbox();
        fireEvent.change(input, { target: { value: '09/16/2022' } });

        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16, 3, 3, 3));
      });
    },
  );

  describeAdapters('Editing from the outside', DateField, ({ adapter, render, clickOnInput }) => {
    it('should be able to reset the value from the outside', () => {
      const { setProps } = render(<DateField value={adapter.date(new Date(2022, 10, 23))} />);
      const input = getTextbox();
      expectInputValue(input, '11/23/2022');

      setProps({ value: null });

      clickOnInput(input, 0);
      expectInputValue(input, 'MM/DD/YYYY');
    });
  });

  describeAdapters('Android editing', DateField, ({ adapter, render, clickOnInput }) => {
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
      render(<DateField defaultValue={adapter.date(new Date(2022, 10, 23))} />);

      const input = getTextbox();
      const initialValueStr = input.value;
      const sectionStart = initialValueStr.indexOf('2');

      clickOnInput(input, sectionStart, sectionStart + 1);

      act(() => {
        // Remove the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('23', '') } });

        // // Set the key pressed in the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('23', '2') } });
      });

      act(() => {
        // Remove the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('23', '') } });

        // Set the key pressed in the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('23', '1') } });
      });

      expectInputValue(input, '11/21/2022');
    });

    it('should support letter editing', () => {
      render(
        <DateField
          defaultValue={adapter.date(new Date(2022, 4, 16))}
          format={`${adapter.formats.month} ${adapter.formats.year}`}
        />,
      );

      const input = getTextbox();
      const initialValueStr = input.value;
      const sectionStart = initialValueStr.indexOf('M');

      clickOnInput(input, sectionStart, sectionStart + 1);

      act(() => {
        // Remove the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('May', '') } });

        // // Set the key pressed in the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('May', 'J') } });
      });

      act(() => {
        // Remove the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('May', '') } });

        // Set the key pressed in the selected section
        fireEvent.change(input, { target: { value: initialValueStr.replace('May', 'u') } });
      });

      expectInputValue(input, 'June 2022');
    });
  });

  describeAdapters('Select all', DateField, ({ adapterName, render, clickOnInput }) => {
    it('should edit the 1st section when all sections are selected', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 0);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      // When all sections are selected, the value only contains the key pressed
      fireEvent.change(input, { target: { value: '9' } });

      expectInputValue(input, adapterName === 'luxon' ? '9/DD/YYYY' : '09/DD/YYYY');
    });
  });
});

import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { DateField, DateFieldProps } from '@mui/x-date-pickers/DateField';
import { screen, act, userEvent, fireEvent } from '@mui/monorepo/test/utils';
import {
  createPickerRenderer,
  adapterToUse,
  buildFieldInteractions,
  expectInputValue,
} from 'test/utils/pickers-utils';

describe('<DateField /> - Editing', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2022, 5, 15),
  });

  const { clickOnInput } = buildFieldInteractions({ clock });

  const selectSection = (input: HTMLInputElement, activeSectionIndex: number) => {
    const value = input.value.replace(':', '/');

    // TODO: Improve this logic when we will be able to access state.sections from the outside
    let clickPosition: number;
    if (activeSectionIndex === 0) {
      clickPosition = 0;
    } else {
      clickPosition =
        (value.split('/', activeSectionIndex - 1).join('/').length +
          value.split('/', activeSectionIndex).join('/').length) /
        2;
    }

    clickOnInput(input, clickPosition);
  };

  const testKeyPress = <TDate extends unknown>({
    key,
    expectedValue,
    cursorPosition = 1,
    valueToSelect,
    ...props
  }: DateFieldProps<TDate> & {
    key: string;
    expectedValue: string;
    cursorPosition?: number;
    valueToSelect?: string;
  }) => {
    render(<DateField {...props} />);
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
    keyStrokes,
    cursorPosition = 1,
    ...props
  }: DateFieldProps<TDate> & {
    keyStrokes: { value: string; expected: string }[];
    cursorPosition?: number;
  }) => {
    render(<DateField {...props} />);
    const input = screen.getByRole('textbox');
    clickOnInput(input, cursorPosition);

    keyStrokes.forEach((keyStroke) => {
      fireEvent.change(input, { target: { value: keyStroke.value } });
      expectInputValue(input, keyStroke.expected);
    });
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
        valueToSelect: '1',
      });
    });

    it('should not edit the value when props.readOnly = true and no value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        readOnly: true,
        key: 'ArrowDown',
        expectedValue: 'YYYY',
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
        valueToSelect: '30',
      });
    });

    it('should not edit the value when props.readOnly = true and no value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        readOnly: true,
        key: 'ArrowUp',
        expectedValue: 'YYYY',
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

  describe('key: Backspace', () => {
    it('should clear the selected section when only this section is completed', () => {
      render(<DateField format={adapterToUse.formats.monthAndYear} />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      // Set a value for the "month" section
      fireEvent.change(input, { target: { value: 'j YYYY' } }); // press "j"
      expectInputValue(input, 'January YYYY');

      userEvent.keyPress(input, { key: 'Backspace' });
      expectInputValue(input, 'MMMM YYYY');
    });

    it('should clear the selected section when all sections are completed', () => {
      testKeyPress({
        format: adapterToUse.formats.monthAndYear,
        defaultValue: adapterToUse.date(),
        key: 'Backspace',
        expectedValue: 'MMMM 2022',
      });
    });

    it('should clear all the sections when all sections are selected and all sections are completed', () => {
      render(
        <DateField format={adapterToUse.formats.monthAndYear} defaultValue={adapterToUse.date()} />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      userEvent.keyPress(input, { key: 'Backspace' });
      expectInputValue(input, 'MMMM YYYY');
    });

    it('should clear all the sections when all sections are selected and not all sections are completed', () => {
      render(<DateField format={adapterToUse.formats.monthAndYear} />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      // Set a value for the "month" section
      fireEvent.change(input, { target: { value: 'j YYYY' } }); // Press "j"
      expectInputValue(input, 'January YYYY');

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      userEvent.keyPress(input, { key: 'Backspace' });
      expectInputValue(input, 'MMMM YYYY');
    });

    it('should not clear the sections when props.readOnly = true', () => {
      testKeyPress({
        format: adapterToUse.formats.year,
        defaultValue: adapterToUse.date(),
        readOnly: true,
        key: 'Backspace',
        expectedValue: '2022',
      });
    });

    it('should only call `onChange` when clearing the last section', () => {
      const handleChange = spy();

      render(
        <DateField
          format={adapterToUse.formats.monthAndYear}
          defaultValue={adapterToUse.date()}
          onChange={handleChange}
        />,
      );

      const input = screen.getByRole('textbox');
      selectSection(input, 0);

      userEvent.keyPress(input, { key: 'Backspace' });
      expect(handleChange.callCount).to.equal(0);

      userEvent.keyPress(input, { key: 'ArrowRight' });

      userEvent.keyPress(input, { key: 'Backspace' });
      expect(handleChange.callCount).to.equal(1);
      expect(handleChange.lastCall.firstArg).to.equal(null);
    });
  });

  describe('Digit editing', () => {
    it('should set the day to the digit pressed when no digit no value is provided', () => {
      testChange({
        format: adapterToUse.formats.dayOfMonth,
        keyStrokes: [{ value: '1', expected: '1' }],
      });
    });

    it('should concatenate the digit pressed to the current section value if the output is valid (digit format)', () => {
      testChange({
        format: adapterToUse.formats.dayOfMonth,
        defaultValue: adapterToUse.date(new Date(2022, 5, 0)),
        keyStrokes: [
          { value: '1', expected: '1' },
          { value: '1', expected: '11' },
        ],
      });
    });

    it('should set the day to the digit pressed if the concatenated value exceeds the maximum value for the section when a value is provided (digit format)', () => {
      testChange({
        format: adapterToUse.formats.dayOfMonth,
        defaultValue: adapterToUse.date(new Date(2022, 5, 4)),
        keyStrokes: [{ value: '1', expected: '1' }],
      });
    });

    it('should concatenate the digit pressed to the current section value if the output is valid (letter format)', () => {
      testChange({
        format: adapterToUse.formats.month,
        defaultValue: adapterToUse.date(new Date(2022, 1, 0)),
        keyStrokes: [
          { value: '1', expected: 'January' },
          { value: '1', expected: 'November' },
        ],
      });
    });

    it('should set the day to the digit pressed if the concatenated value exceeds the maximum value for the section when a value is provided (letter format)', () => {
      testChange({
        format: adapterToUse.formats.month,
        defaultValue: adapterToUse.date(new Date(2022, 5, 0)),
        keyStrokes: [{ value: '1', expected: 'January' }],
      });
    });

    it('should support 2-digits year format', () => {
      testChange({
        format: 'yy', // This format is not present in any of the adapter formats
        keyStrokes: [
          { value: '2', expected: '02' },
          { value: '2', expected: '22' },
          { value: '3', expected: '03' },
        ],
      });
    });

    it('should support 4-digits year format', () => {
      testChange({
        format: adapterToUse.formats.year,
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
      testChange({
        format: 'M', // This format is not present in any of the adapter formats
        keyStrokes: [
          { value: '1', expected: '1' },
          { value: '1', expected: '11' },
          { value: '2', expected: '2' },
        ],
      });
    });

    it('should not edit when props.readOnly = true and no value is provided', () => {
      testChange({
        format: adapterToUse.formats.year,
        readOnly: true,
        keyStrokes: [{ value: '1', expected: 'YYYY' }],
      });
    });

    it('should not edit value when props.readOnly = true and a value is provided', () => {
      testChange({
        format: adapterToUse.formats.year,
        defaultValue: adapterToUse.date(),
        readOnly: true,
        keyStrokes: [{ value: '1', expected: '2022' }],
      });
    });
  });

  describe('Letter editing', () => {
    it('should select the first matching month with no previous query and no value is provided (letter format)', () => {
      testChange({
        format: adapterToUse.formats.month,
        keyStrokes: [{ value: 'm', expected: 'March' }],
      });
    });

    it('should select the first matching month with no previous query and a value is provided (letter format)', () => {
      testChange({
        format: adapterToUse.formats.month,
        defaultValue: adapterToUse.date(),
        keyStrokes: [{ value: 'm', expected: 'March' }],
      });
    });

    it('should use the previously typed letters as long as it matches at least one month (letter format)', () => {
      testChange({
        format: adapterToUse.formats.month,
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
      testChange({
        format: 'MM', // This format is not present in any of the adapter formats
        keyStrokes: [{ value: 'm', expected: '03' }],
      });
    });

    it('should select the first matching month with no previous query and a value is provided (digit format)', () => {
      testChange({
        format: 'MM', // This format is not present in any of the adapter formats
        defaultValue: adapterToUse.date(),
        keyStrokes: [{ value: 'm', expected: '03' }],
      });
    });

    it('should use the previously typed letters as long as it matches at least one month (digit format)', () => {
      testChange({
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

    it('should not edit when props.readOnly = true and no value is provided', () => {
      testKeyPress({
        format: adapterToUse.formats.month,
        readOnly: true,
        key: '1',
        expectedValue: 'MMMM',
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

  describe('Full editing scenarios', () => {
    it('should move to the last day of the month when the current day exceeds it', () => {
      const onChange = spy();

      render(<DateField onChange={onChange} />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      fireEvent.change(input, { target: { value: '2 / DD / YYYY' } }); // Press "2"
      expectInputValue(input, '02 / DD / YYYY');

      fireEvent.change(input, { target: { value: '02 / 3 / YYYY' } }); // Press "3"
      expectInputValue(input, '02 / 03 / YYYY');
      fireEvent.change(input, { target: { value: '02 / 1 / YYYY' } }); // Press "3"
      expectInputValue(input, '02 / 31 / YYYY');

      fireEvent.change(input, { target: { value: '02 / 31 / 2' } }); // Press "2"
      expectInputValue(input, '02 / 28 / 0002'); // Has moved to the last day of the February
      fireEvent.change(input, { target: { value: '02 / 28 / 0' } }); // Press "0"
      fireEvent.change(input, { target: { value: '02 / 28 / 2' } }); // Press "2"
      fireEvent.change(input, { target: { value: '02 / 28 / 2' } }); // Press "2"
      expectInputValue(input, '02 / 28 / 2022');

      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 1, 28, 0, 0, 0));
    });
  });

  describe('Pasting', () => {
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
      render(<DateField onChange={onChange} defaultValue={adapterToUse.date()} />);
      const input = screen.getByRole('textbox');
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
      const input = screen.getByRole('textbox');
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
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEvent(input, 'Some invalid content');
      expectInputValue(input, 'MM / DD / YYYY');
    });

    it('should set the date when all sections are selected and the format contains escaped characters', () => {
      const { start: startChar, end: endChar } = adapterToUse.escapedCharacters;
      const onChange = spy();
      render(
        <DateField
          onChange={onChange}
          format={`${startChar}Escaped${endChar} ${adapterToUse.formats.year}`}
        />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEvent(input, `Escaped 2014`);
      expect(onChange.callCount).to.equal(1);
      expect(adapterToUse.getYear(onChange.lastCall.firstArg)).to.equal(2014);
    });

    it('should not set the date when all sections are selected and props.readOnly = true', () => {
      const onChange = spy();
      render(<DateField onChange={onChange} readOnly />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      firePasteEvent(input, '09/16/2022');
      expect(onChange.callCount).to.equal(0);
    });

    it('should set the section when one section is selected, the pasted value has the correct type and no value is provided', () => {
      const onChange = spy();
      render(<DateField onChange={onChange} />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      expectInputValue(input, 'MM / DD / YYYY');
      firePasteEvent(input, '12');

      expect(onChange.callCount).to.equal(0);
      expectInputValue(input, '12 / DD / YYYY');
    });

    it('should set the section when one section is selected, the pasted value has the correct type and value is provided', () => {
      const onChange = spy();
      render(
        <DateField onChange={onChange} defaultValue={adapterToUse.date(new Date(2018, 0, 13))} />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      expectInputValue(input, '01 / 13 / 2018');
      firePasteEvent(input, '12');
      expectInputValue(input, '12 / 13 / 2018');
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 11, 13));
    });

    it('should not update the section when one section is selected and the pasted value has incorrect type', () => {
      const onChange = spy();
      render(
        <DateField onChange={onChange} defaultValue={adapterToUse.date(new Date(2018, 0, 13))} />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      expectInputValue(input, '01 / 13 / 2018');
      firePasteEvent(input, 'Jun');
      expectInputValue(input, '01 / 13 / 2018');
      expect(onChange.callCount).to.equal(0);
    });
  });

  describe('Do not loose missing section values ', () => {
    it('should not loose time information when a value is provided', () => {
      const onChange = spy();

      render(
        <DateField
          defaultValue={adapterToUse.date(new Date(2010, 3, 3, 3, 3, 3))}
          onChange={onChange}
        />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, input.value.indexOf('2010'));
      userEvent.keyPress(input, { key: 'ArrowDown' });

      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
    });

    it('should not loose time information when cleaning the date then filling it again', () => {
      const onChange = spy();

      render(
        <DateField
          defaultValue={adapterToUse.date(new Date(2010, 3, 3, 3, 3, 3))}
          onChange={onChange}
        />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      userEvent.keyPress(input, { key: 'Backspace' });

      fireEvent.change(input, { target: { value: '4 / DD / YYYY' } }); // Press "4"
      expectInputValue(input, '04 / DD / YYYY');

      fireEvent.change(input, { target: { value: '04 / 0 / YYYY' } }); // Press "0"
      fireEvent.change(input, { target: { value: '04 / 3 / YYYY' } }); // Press "3"
      expectInputValue(input, '04 / 03 / YYYY');

      fireEvent.change(input, { target: { value: '04 / 03 / 2' } }); // Press "2"
      fireEvent.change(input, { target: { value: '04 / 03 / 0' } }); // Press "0"
      fireEvent.change(input, { target: { value: '04 / 03 / 0' } }); // Press "0"
      fireEvent.change(input, { target: { value: '04 / 03 / 9' } }); // Press "9"
      expectInputValue(input, '04 / 03 / 2009');

      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
    });

    it('should not loose date information when using the year format and value is provided', () => {
      const onChange = spy();

      render(
        <DateField
          format={adapterToUse.formats.year}
          defaultValue={adapterToUse.date(new Date(2010, 3, 3, 3, 3, 3))}
          onChange={onChange}
        />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);
      userEvent.keyPress(input, { key: 'ArrowDown' });

      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2009, 3, 3, 3, 3, 3));
    });

    it('should not loose date information when using the month format and value is provided', () => {
      const onChange = spy();

      render(
        <DateField
          format={adapterToUse.formats.month}
          defaultValue={adapterToUse.date(new Date(2010, 3, 3, 3, 3, 3))}
          onChange={onChange}
        />,
      );
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);
      userEvent.keyPress(input, { key: 'ArrowDown' });

      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2010, 2, 3, 3, 3, 3));
    });
  });

  describe('Imperative change (without any section selected)', () => {
    it('should set the date when the change value is valid and no value is provided', () => {
      const onChange = spy();
      render(<DateField onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '09/16/2022' } });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16));
    });

    it('should set the date when the change value is valid and a value is provided', () => {
      const onChange = spy();
      render(
        <DateField
          defaultValue={adapterToUse.date(new Date(2010, 3, 3, 3, 3, 3))}
          onChange={onChange}
        />,
      );
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '09/16/2022' } });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 8, 16, 3, 3, 3));
    });
  });

  describe('Android editing', () => {
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
      render(<DateField defaultValue={adapterToUse.date(new Date(2022, 4, 16))} />);

      const input = screen.getByRole('textbox');
      const initialValueStr = input.value;
      const sectionStart = initialValueStr.indexOf('1');

      clickOnInput(input, sectionStart, sectionStart + 1);

      // Remove the selected section
      fireEvent.change(input, { target: { value: initialValueStr.replace('16', '') } });

      // // Set the key pressed in the selected section
      fireEvent.change(input, { target: { value: initialValueStr.replace('16', '2') } });

      // Remove the selected section
      fireEvent.change(input, { target: { value: initialValueStr.replace('16', '') } });

      // Set the key pressed in the selected section
      fireEvent.change(input, { target: { value: initialValueStr.replace('16', '1') } });

      expectInputValue(input, '05 / 21 / 2022');
    });

    it('should support letter editing', () => {
      render(
        <DateField
          defaultValue={adapterToUse.date(new Date(2022, 4, 16))}
          format={`${adapterToUse.formats.month} ${adapterToUse.formats.year}`}
        />,
      );

      const input = screen.getByRole('textbox');
      const initialValueStr = input.value;
      const sectionStart = initialValueStr.indexOf('M');

      clickOnInput(input, sectionStart, sectionStart + 1);

      // Remove the selected section
      fireEvent.change(input, { target: { value: initialValueStr.replace('May', '') } });

      // // Set the key pressed in the selected section
      fireEvent.change(input, { target: { value: initialValueStr.replace('May', 'J') } });

      // Remove the selected section
      fireEvent.change(input, { target: { value: initialValueStr.replace('May', '') } });

      // Set the key pressed in the selected section
      fireEvent.change(input, { target: { value: initialValueStr.replace('May', 'u') } });

      expectInputValue(input, 'June 2022');
    });
  });
});

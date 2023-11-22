import { expect } from 'chai';
import { spy } from 'sinon';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { userEvent, fireEvent } from '@mui-internal/test-utils';
import { expectInputValue, describeAdapters } from 'test/utils/pickers';

describe('<SingleInputDateRangeField /> - Editing', () => {
  describeAdapters(`key: Delete`, SingleInputDateRangeField, ({ adapter, renderWithProps }) => {
    it('should clear all the sections when all sections are selected and all sections are completed', () => {
      const { input, selectSection } = renderWithProps({
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      selectSection('month');

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      userEvent.keyPress(input, { key: 'Delete' });
      expectInputValue(input, 'MMMM YYYY – MMMM YYYY');
    });

    it('should clear all the sections when all sections are selected and not all sections are completed', () => {
      const { input, selectSection } = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      selectSection('month');

      // Set a value for the "month" section
      fireEvent.change(input, {
        target: { value: 'j YYYY – MMMM YYYY' },
      }); // Press "j"
      expectInputValue(input, 'January YYYY – MMMM YYYY');

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      userEvent.keyPress(input, { key: 'Delete' });
      expectInputValue(input, 'MMMM YYYY – MMMM YYYY');
    });

    it('should not call `onChange` when clearing all sections and both dates are already empty', () => {
      const onChange = spy();

      const { input, selectSection } = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: [null, null],
        onChange,
      });

      selectSection('month');

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });

      userEvent.keyPress(input, { key: 'Delete' });
      expect(onChange.callCount).to.equal(0);
    });

    it('should call `onChange` when clearing the each section of each date', () => {
      const handleChange = spy();

      const { selectSection, input } = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange: handleChange,
      });

      selectSection('month');

      // Start date
      userEvent.keyPress(input, { key: 'Delete' });
      expect(handleChange.callCount).to.equal(1);
      userEvent.keyPress(input, { key: 'ArrowRight' });
      userEvent.keyPress(input, { key: 'Delete' });
      expect(handleChange.callCount).to.equal(2);
      expect(handleChange.lastCall.firstArg[0]).to.equal(null);
      expect(handleChange.lastCall.firstArg[1]).toEqualDateTime(
        adapter.addYears(adapter.date(), 1),
      );

      // End date
      userEvent.keyPress(input, { key: 'ArrowRight' });
      userEvent.keyPress(input, { key: 'Delete' });
      expect(handleChange.callCount).to.equal(3);
      userEvent.keyPress(input, { key: 'ArrowRight' });
      userEvent.keyPress(input, { key: 'Delete' });
      expect(handleChange.callCount).to.equal(4);
      expect(handleChange.lastCall.firstArg[0]).to.equal(null);
      expect(handleChange.lastCall.firstArg[1]).to.equal(null);
    });

    it('should not call `onChange` if the section is already empty', () => {
      const handleChange = spy();

      const { selectSection, input } = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange: handleChange,
      });

      selectSection('month');
      userEvent.keyPress(input, { key: 'Delete' });
      expect(handleChange.callCount).to.equal(1);

      userEvent.keyPress(input, { key: 'Delete' });
      expect(handleChange.callCount).to.equal(1);
    });
  });

  describeAdapters(
    `Backspace editing`,
    SingleInputDateRangeField,
    ({ adapter, renderWithProps, testFieldChange }) => {
      it('should clear all the sections when all sections are selected and all sections are completed (Backspace)', () => {
        testFieldChange({
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          keyStrokes: [{ value: '', expected: 'MMMM YYYY – MMMM YYYY' }],
        });
      });

      it('should clear all the sections when all sections are selected and not all sections are completed (Backspace)', () => {
        testFieldChange({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          keyStrokes: [
            { value: 'j YYYY – MMMM YYYY', expected: 'January YYYY – MMMM YYYY' },
            { value: '', expected: 'MMMM YYYY – MMMM YYYY' },
          ],
        });
      });

      it('should not call `onChange` when clearing all sections and both dates are already empty (Backspace)', () => {
        const onChange = spy();

        testFieldChange({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          keyStrokes: [{ value: '', expected: 'MMMM YYYY – MMMM YYYY' }],
        });

        expect(onChange.callCount).to.equal(0);
      });

      it('should call `onChange` when clearing the each section of each date (Backspace)', () => {
        const onChange = spy();

        const { selectSection, input } = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange,
        });

        selectSection('month');

        // Start date
        fireEvent.change(input, { target: { value: ' 2022 – June 2023' } });
        expect(onChange.callCount).to.equal(1);
        userEvent.keyPress(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MMMM  – June 2023' } });
        expect(onChange.callCount).to.equal(2);
        expect(onChange.lastCall.firstArg[0]).to.equal(null);
        expect(onChange.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));

        // End date
        userEvent.keyPress(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MMMM YYYY –  2023' } });
        expect(onChange.callCount).to.equal(3);
        userEvent.keyPress(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MMMM YYYY – MMMM ' } });
        expect(onChange.callCount).to.equal(4);
        expect(onChange.lastCall.firstArg[0]).to.equal(null);
        expect(onChange.lastCall.firstArg[1]).to.equal(null);
      });

      it('should not call `onChange` if the section is already empty (Backspace)', () => {
        const onChange = spy();

        testFieldChange({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange,
          keyStrokes: [
            { value: ' 2022 – June 2023', expected: 'MMMM 2022 – June 2023' },
            { value: ' 2022 – June 2023', expected: 'MMMM 2022 – June 2023' },
          ],
        });

        expect(onChange.callCount).to.equal(1);
      });
    },
  );
});

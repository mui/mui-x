import { expect } from 'chai';
import { spy } from 'sinon';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { userEvent, fireEvent } from '@mui/monorepo/test/utils';
import { expectInputValue } from 'test/utils/pickers';
import { describeAdapters } from '@mui/x-date-pickers/tests/describeAdapters';

describe('<SingleInputDateRangeField /> - Editing', () => {
  ['Backspace', 'Delete'].forEach((keyToClearValue) => {
    describeAdapters(
      `key: ${keyToClearValue}`,
      SingleInputDateRangeField,
      ({ adapter, renderWithProps }) => {
        it('should clear all the sections when all sections are selected and all sections are completed', () => {
          const { input, selectSection } = renderWithProps({
            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
            format: adapter.formats.monthAndYear,
          });

          selectSection('month');

          // Select all sections
          userEvent.keyPress(input, { key: 'a', ctrlKey: true });

          userEvent.keyPress(input, { key: keyToClearValue });
          expectInputValue(input, 'MMMM YYYY – MMMM YYYY');
        });

        it('should clear all the sections when all sections are selected and not all sections are completed', () => {
          const { input, selectSection } = renderWithProps({
            format: adapter.formats.monthAndYear,
          });

          selectSection('month');

          // Set a value for the "month" section
          fireEvent.change(input, {
            target: { value: 'j YYYY – MMMM YYYY' },
          }); // Press "j"
          expectInputValue(input, 'January YYYY – MMMM YYYY');

          // Select all sections
          userEvent.keyPress(input, { key: 'a', ctrlKey: true });

          userEvent.keyPress(input, { key: keyToClearValue });
          expectInputValue(input, 'MMMM YYYY – MMMM YYYY');
        });

        it('should not call `onChange` when clearing all sections and both dates are already empty', () => {
          const onChange = spy();

          const { input, selectSection } = renderWithProps({
            format: adapter.formats.monthAndYear,
            defaultValue: [null, null],
            onChange,
          });

          selectSection('month');

          // Select all sections
          userEvent.keyPress(input, { key: 'a', ctrlKey: true });

          userEvent.keyPress(input, { key: keyToClearValue });
          expect(onChange.callCount).to.equal(0);
        });

        it('should call `onChange` when clearing the each section of each date', () => {
          const handleChange = spy();

          const { selectSection, input } = renderWithProps({
            format: adapter.formats.monthAndYear,
            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
            onChange: handleChange,
          });

          selectSection('month');

          // Start date
          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(1);
          userEvent.keyPress(input, { key: 'ArrowRight' });
          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(2);
          expect(handleChange.lastCall.firstArg[0]).to.equal(null);
          expect(handleChange.lastCall.firstArg[1]).toEqualDateTime(
            adapter.addYears(adapter.date(), 1),
          );

          // End date
          userEvent.keyPress(input, { key: 'ArrowRight' });
          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(3);
          userEvent.keyPress(input, { key: 'ArrowRight' });
          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(4);
          expect(handleChange.lastCall.firstArg[0]).to.equal(null);
          expect(handleChange.lastCall.firstArg[1]).to.equal(null);
        });

        it('should not call `onChange` if the section is already empty', () => {
          const handleChange = spy();

          const { selectSection, input } = renderWithProps({
            format: adapter.formats.monthAndYear,
            defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
            onChange: handleChange,
          });

          selectSection('month');
          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(1);

          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(1);
        });
      },
    );
  });
});

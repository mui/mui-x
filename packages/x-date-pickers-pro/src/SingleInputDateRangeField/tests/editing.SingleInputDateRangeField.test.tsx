import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { screen, userEvent, fireEvent } from '@mui/monorepo/test/utils';
import { expectInputValue } from 'test/utils/pickers-utils';
import { describeAdapters } from '@mui/x-date-pickers/tests/describeAdapters';

describe('<SingleInputDateRangeField /> - Editing', () => {
  ['Backspace', 'Delete'].forEach((keyToClearValue) => {
    describeAdapters(
      `key: ${keyToClearValue}`,
      SingleInputDateRangeField,
      ({ render, adapter, clickOnInput, selectSection }) => {
        it('should clear all the sections when all sections are selected and all sections are completed', () => {
          render(
            <SingleInputDateRangeField
              format={adapter.formats.monthAndYear}
              defaultValue={[adapter.date(), adapter.addYears(adapter.date(), 1)]}
            />,
          );
          const input = screen.getByRole<HTMLInputElement>('textbox');
          clickOnInput(input, 1);

          // Select all sections
          userEvent.keyPress(input, { key: 'a', ctrlKey: true });

          userEvent.keyPress(input, { key: keyToClearValue });
          expectInputValue(input, 'MMMM YYYY – MMMM YYYY');
        });

        it('should clear all the sections when all sections are selected and not all sections are completed', () => {
          render(<SingleInputDateRangeField format={adapter.formats.monthAndYear} />);
          const input = screen.getByRole<HTMLInputElement>('textbox');
          clickOnInput(input, 1);

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
          const handleChange = spy();

          render(
            <SingleInputDateRangeField
              format={adapter.formats.monthAndYear}
              defaultValue={[null, null]}
              onChange={handleChange}
            />,
          );

          const input = screen.getByRole<HTMLInputElement>('textbox');
          clickOnInput(input, 1);

          // Select all sections
          userEvent.keyPress(input, { key: 'a', ctrlKey: true });

          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(0);
        });

        it('should call `onChange` when clearing the each section of each date', () => {
          const handleChange = spy();

          render(
            <SingleInputDateRangeField
              format={adapter.formats.monthAndYear}
              defaultValue={[adapter.date(), adapter.addYears(adapter.date(), 1)]}
              onChange={handleChange}
            />,
          );

          const input = screen.getByRole<HTMLInputElement>('textbox');
          selectSection(input, 0);

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

          render(
            <SingleInputDateRangeField
              format={adapter.formats.monthAndYear}
              defaultValue={[adapter.date(), adapter.addYears(adapter.date(), 1)]}
              onChange={handleChange}
            />,
          );

          const input = screen.getByRole<HTMLInputElement>('textbox');
          selectSection(input, 0);

          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(1);

          userEvent.keyPress(input, { key: keyToClearValue });
          expect(handleChange.callCount).to.equal(1);
        });
      },
    );
  });
});

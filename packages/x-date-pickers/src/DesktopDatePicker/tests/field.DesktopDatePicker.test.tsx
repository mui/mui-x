import * as React from 'react';
import { fireEvent, userEvent } from '@mui/monorepo/test/utils';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {
  createPickerRenderer,
  getTextbox,
  expectInputPlaceholder,
  adapterToUse,
  expectInputValue,
  buildFieldInteractions,
} from 'test/utils/pickers-utils';

describe('<DesktopDatePicker /> - Field', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });
  const { clickOnInput } = buildFieldInteractions({ clock, render, Component: DesktopDatePicker });

  it('should be able to reset a single section', () => {
    render(<DesktopDatePicker format={adapterToUse.formats.monthAndDate} />);

    const input = getTextbox();
    expectInputPlaceholder(input, 'MMMM DD');
    clickOnInput(input, 1);

    fireEvent.change(input, { target: { value: 'N DD' } }); // Press "1"
    expectInputValue(input, 'November DD');

    fireEvent.change(input, { target: { value: 'November 4' } }); // Press "1"
    expectInputValue(input, 'November 4');

    userEvent.keyPress(input, { key: 'Backspace' });
    expectInputValue(input, 'November DD');
  });
});

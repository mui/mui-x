import * as React from 'react';
import { fireEvent, userEvent } from '@mui/monorepo/test/utils';
import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
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
    expectInputValue(input, 'November 04');

    userEvent.keyPress(input, { key: 'Backspace' });
    expectInputValue(input, 'November DD');
  });

  it('should adapt the default field format based on the props of the picker', () => {
    const testFormat = (props: DesktopDatePickerProps<any>, expectedFormat: string) => {
      const { unmount } = render(<DesktopDatePicker {...props} />);
      const input = getTextbox();
      expectInputPlaceholder(input, expectedFormat);
      unmount();
    };

    testFormat({ views: ['year'] }, 'YYYY');
    testFormat({ views: ['month'] }, 'MMMM');
    testFormat({ views: ['day'] }, 'DD');
    testFormat({ views: ['month', 'day'] }, 'MMMM DD');
    testFormat({ views: ['year', 'month'] }, 'MMMM YYYY');
    testFormat({ views: ['year', 'month', 'day'] }, 'MM/DD/YYYY');
    testFormat({ views: ['year', 'day'] }, 'MM/DD/YYYY');
  });
});

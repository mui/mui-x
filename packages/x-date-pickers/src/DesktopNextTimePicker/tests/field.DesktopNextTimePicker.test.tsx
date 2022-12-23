import * as React from 'react';
import { screen } from '@mui/monorepo/test/utils';
import { createPickerRenderer, expectInputValue } from 'test/utils/pickers-utils';
import { Unstable_DesktopNextTimePicker as DesktopNextTimePicker } from '@mui/x-date-pickers/DesktopNextTimePicker';

describe('<DesktopNextTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<DesktopNextTimePicker ampm />);

    const input = screen.getByRole('textbox');
    expectInputValue(input, 'hh:mm aa');

    setProps({ ampm: false });
    expectInputValue(input, 'hh:mm');
  });
});

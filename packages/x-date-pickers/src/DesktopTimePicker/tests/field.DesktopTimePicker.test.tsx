import * as React from 'react';
import { createPickerRenderer, expectInputValue, getTextbox } from 'test/utils/pickers-utils';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

describe('<DesktopTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<DesktopTimePicker ampm />);

    const input = getTextbox();
    expectInputValue(input, 'hh:mm aa');

    setProps({ ampm: false });
    expectInputValue(input, 'hh:mm');
  });
});

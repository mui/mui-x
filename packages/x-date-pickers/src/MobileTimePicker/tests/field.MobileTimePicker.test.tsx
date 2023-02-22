import * as React from 'react';
import { createPickerRenderer, expectInputValue, getTextbox } from 'test/utils/pickers-utils';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

describe('<MobileTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<MobileTimePicker ampm />);

    const input = getTextbox();
    expectInputValue(input, 'hh:mm aa');

    setProps({ ampm: false });
    expectInputValue(input, 'hh:mm');
  });
});

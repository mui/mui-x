import * as React from 'react';
import { createPickerRenderer, getTextbox, expectInputPlaceholder } from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

describe('<MobileTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<MobileTimePicker ampm />);

    const input = getTextbox();
    expectInputPlaceholder(input, 'hh:mm aa');

    setProps({ ampm: false });
    expectInputPlaceholder(input, 'hh:mm');
  });
});

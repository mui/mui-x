import * as React from 'react';
import { createPickerRenderer, getTextbox, expectInputPlaceholder } from 'test/utils/pickers-utils';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

describe('<DesktopDateTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<DesktopDateTimePicker ampm />);

    const input = getTextbox();
    expectInputPlaceholder(input, 'MM/DD/YYYY hh:mm aa');

    setProps({ ampm: false });
    expectInputPlaceholder(input, 'MM/DD/YYYY hh:mm');
  });
});

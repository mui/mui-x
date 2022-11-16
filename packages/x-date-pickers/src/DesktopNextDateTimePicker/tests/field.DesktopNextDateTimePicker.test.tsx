import * as React from 'react';
import { screen } from '@mui/monorepo/test/utils';
import { createPickerRenderer, expectInputValue } from 'test/utils/pickers-utils';
import { Unstable_DesktopNextDateTimePicker as DesktopNextDateTimePicker } from '@mui/x-date-pickers/DesktopNextDateTimePicker';

describe('<DesktopNextDateTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<DesktopNextDateTimePicker ampm />);

    const input = screen.getByRole('textbox');
    expectInputValue(input, 'MM / DD / YYYY hh:mm aa');

    setProps({ ampm: false });
    expectInputValue(input, 'MM / DD / YYYY hh:mm');
  });
});

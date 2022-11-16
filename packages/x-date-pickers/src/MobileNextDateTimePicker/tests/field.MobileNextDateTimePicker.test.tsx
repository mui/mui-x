import * as React from 'react';
import { screen } from '@mui/monorepo/test/utils';
import { createPickerRenderer, expectInputValue } from 'test/utils/pickers-utils';
import { Unstable_MobileNextDateTimePicker as MobileNextDateTimePicker } from '@mui/x-date-pickers/MobileNextDateTimePicker';

describe('<MobileNextDateTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<MobileNextDateTimePicker ampm />);

    const input = screen.getByRole('textbox');
    expectInputValue(input, 'MM / DD / YYYY hh:mm aa');

    setProps({ ampm: false });
    expectInputValue(input, 'MM / DD / YYYY hh:mm');
  });
});

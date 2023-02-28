import * as React from 'react';
import { screen } from '@mui/monorepo/test/utils';
import { createPickerRenderer, expectInputPlaceholder } from 'test/utils/pickers-utils';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

describe('<MobileTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<MobileTimePicker ampm />);

    const input = screen.getByRole('textbox');
    expectInputPlaceholder(input, 'hh:mm aa');

    setProps({ ampm: false });
    expectInputPlaceholder(input, 'hh:mm');
  });
});

import * as React from 'react';
import { screen } from '@mui/monorepo/test/utils';
import { createPickerRenderer, expectInputPlaceholder } from 'test/utils/pickers-utils';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

describe('<MobileDateTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<MobileDateTimePicker ampm />);

    const input = screen.getByRole('textbox');
    expectInputPlaceholder(input, 'MM/DD/YYYY hh:mm aa');

    setProps({ ampm: false });
    expectInputPlaceholder(input, 'MM/DD/YYYY hh:mm');
  });
});

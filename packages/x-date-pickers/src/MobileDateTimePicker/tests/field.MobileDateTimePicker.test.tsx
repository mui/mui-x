import * as React from 'react';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { createPickerRenderer } from 'test/utils/pickers/createPickerRenderer';
import { getTextbox } from 'test/utils/pickers/fields';
import { expectInputPlaceholder } from 'test/utils/pickers/assertions';

describe('<MobileDateTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<MobileDateTimePicker ampm />);

    const input = getTextbox();
    expectInputPlaceholder(input, 'MM/DD/YYYY hh:mm aa');

    setProps({ ampm: false });
    expectInputPlaceholder(input, 'MM/DD/YYYY hh:mm');
  });
});

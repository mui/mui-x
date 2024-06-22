import * as React from 'react';
import { expect } from 'chai';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { screen } from '@mui/internal-test-utils/createRenderer';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';
import { pickersInputBaseClasses } from '@mui/x-date-pickers/PickersTextField';

describe('<DateTimePicker />', () => {
  const { render } = createPickerRenderer();

  it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(<DateTimePicker enableAccessibleFieldDOMStructure />);

    expect(screen.getByLabelText(/Choose date/)).to.have.class(pickersInputBaseClasses.input);

    window.matchMedia = originalMatchMedia;
  });
});

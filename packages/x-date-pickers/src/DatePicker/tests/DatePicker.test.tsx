import * as React from 'react';
import { expect } from 'chai';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { screen } from '@mui/internal-test-utils/createRenderer';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';
import { pickersInputBaseClasses } from '@mui/x-date-pickers/PickersTextField';

describe('<DatePicker />', () => {
  const { render } = createPickerRenderer();

  it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(<DatePicker enableAccessibleFieldDOMStructure />);

    expect(screen.getByLabelText(/Choose date/)).to.have.class(pickersInputBaseClasses.input);

    window.matchMedia = originalMatchMedia;
  });
});

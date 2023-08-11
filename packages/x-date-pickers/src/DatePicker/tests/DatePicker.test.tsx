import * as React from 'react';
import { expect } from 'chai';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';

describe('<DatePicker />', () => {
  const { render } = createPickerRenderer();

  it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(<DatePicker />);

    expect(screen.getByLabelText(/Choose date/)).to.have.tagName('input');

    window.matchMedia = originalMatchMedia;
  });
});

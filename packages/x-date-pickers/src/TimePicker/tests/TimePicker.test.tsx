import * as React from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';

describe('<TimePicker />', () => {
  const { render } = createPickerRenderer();

  it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(<TimePicker />);

    expect(screen.getByLabelText(/Choose time/)).to.have.tagName('input');

    window.matchMedia = originalMatchMedia;
  });
});

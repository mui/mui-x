import * as React from 'react';
import { expect } from 'chai';
import { dialogClasses } from '@mui/material/Dialog';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { screen } from '@mui/internal-test-utils/createRenderer';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';

describe('<TimePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  it('should render in mobile mode when `useMediaQuery` returns `false`', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    const { user } = render(<TimePicker />);

    await user.click(screen.getByLabelText(/Choose time/));
    expect(screen.getByRole('dialog')).to.have.class(dialogClasses.paper);

    window.matchMedia = originalMatchMedia;
  });
});

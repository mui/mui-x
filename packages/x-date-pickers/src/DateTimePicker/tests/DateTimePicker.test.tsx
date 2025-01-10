import * as React from 'react';
import { expect } from 'chai';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { screen } from '@mui/internal-test-utils/createRenderer';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';

describe('<DateTimePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  it('should render in mobile mode when `useMediaQuery` returns `false`', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    const { user } = render(<DateTimePicker />);

    await user.click(screen.getByLabelText(/Choose date/));
    expect(screen.getAllByRole('dialog')).to.have.length(1);

    window.matchMedia = originalMatchMedia;
  });
});

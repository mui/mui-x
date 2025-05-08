import * as React from 'react';
import { expect } from 'chai';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { screen } from '@mui/internal-test-utils/createRenderer';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';

describe('<TimePicker />', () => {
  const { render } = createPickerRenderer();

  it('should render in mobile mode when `useMediaQuery` returns `false`', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    const { user } = render(<TimePicker />);

    await user.click(screen.getByLabelText(/Choose time/));
    expect(screen.queryByRole('dialog')).to.not.equal(null);

    window.matchMedia = originalMatchMedia;
  });
});

import * as React from 'react';
import { expect } from 'chai';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { fireEvent, screen } from '@mui/internal-test-utils/createRenderer';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';

describe('<TimePicker />', () => {
  const { render } = createPickerRenderer();

  it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(<TimePicker />);

    fireEvent.click(screen.getByLabelText(/Choose time/));
    expect(screen.getAllByRole('dialog')).to.have.length(1);

    window.matchMedia = originalMatchMedia;
  });
});

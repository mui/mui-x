import * as React from 'react';
import { expect } from 'chai';
import { dialogClasses } from '@mui/material/Dialog';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { fireEvent, screen } from '@mui/internal-test-utils/createRenderer';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';

describe('<DateTimePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(<DateTimePicker />);

    fireEvent.click(screen.getByLabelText(/Choose date/));
    expect(screen.getByRole('dialog')).to.have.class(dialogClasses.paper);

    window.matchMedia = originalMatchMedia;
  });
});

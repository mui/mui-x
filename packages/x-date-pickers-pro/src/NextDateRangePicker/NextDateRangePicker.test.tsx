import * as React from 'react';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';
import { fireEvent, screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers-utils';

describe('<NextDateRangePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  it('should not open mobile picker dialog when clicked on input', () => {
    render(<NextDateRangePicker />);
    fireEvent.click(screen.getAllByRole('textbox')[0]);
    clock.runToLast();

    expect(screen.queryByRole('tooltip')).not.to.equal(null);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('should open mobile picker dialog when clicked on input when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(<NextDateRangePicker />);
    fireEvent.click(screen.getAllByRole('textbox')[0]);
    clock.runToLast();

    expect(screen.getByRole('dialog')).not.to.equal(null);
    expect(screen.queryByRole('tooltip')).to.equal(null);

    window.matchMedia = originalMatchMedia;
  });
});

import * as React from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { fireEvent, screen } from '@mui/internal-test-utils/createRenderer';
import { expect } from 'chai';
import {
  buildFieldInteractions,
  createPickerRenderer,
  getFieldInputRoot,
  stubMatchMedia,
} from 'test/utils/pickers';

describe('<DateRangePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  const { renderWithProps } = buildFieldInteractions({
    render,
    clock,
    Component: DateRangePicker,
  });

  it('should not open mobile picker dialog when clicked on input', () => {
    // Test with v7 input
    const { unmount } = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    fireEvent.click(getFieldInputRoot());
    clock.runToLast();

    expect(screen.queryByRole('tooltip')).not.to.equal(null);
    expect(screen.queryByRole('dialog')).to.equal(null);

    unmount();

    // Test with v6 input
    renderWithProps({ enableAccessibleFieldDOMStructure: false });
    fireEvent.click(screen.getAllByRole('textbox')[0]);
    clock.runToLast();

    expect(screen.queryByRole('tooltip')).not.to.equal(null);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('should open mobile picker dialog when clicked on input when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(<DateRangePicker enableAccessibleFieldDOMStructure />);
    fireEvent.click(getFieldInputRoot());
    clock.runToLast();

    expect(screen.getByRole('dialog')).not.to.equal(null);
    expect(screen.queryByRole('tooltip')).to.equal(null);

    window.matchMedia = originalMatchMedia;
  });
});

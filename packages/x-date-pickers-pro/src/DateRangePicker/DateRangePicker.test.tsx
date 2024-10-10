import * as React from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { screen } from '@mui/internal-test-utils/createRenderer';
import { expect } from 'chai';
import {
  buildFieldInteractions,
  createPickerRenderer,
  getFieldInputRoot,
  stubMatchMedia,
} from 'test/utils/pickers';

describe('<DateRangePicker />', () => {
  const { render, clock } = createPickerRenderer();

  const { renderWithProps } = buildFieldInteractions({
    render,
    clock,
    Component: DateRangePicker,
  });

  it('should not open mobile picker dialog when clicked on input', async () => {
    // Test with v7 input
    let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    await view.user.click(getFieldInputRoot());

    expect(screen.queryByRole('tooltip')).not.to.equal(null);
    expect(screen.queryByRole('dialog')).to.equal(null);

    view.unmount();

    // Test with v6 input
    view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
    await view.user.click(screen.getAllByRole('textbox')[0]);

    expect(screen.queryByRole('tooltip')).not.to.equal(null);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('should open mobile picker dialog when clicked on input when `useMediaQuery` returns `false`', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    const { user } = render(<DateRangePicker enableAccessibleFieldDOMStructure />);
    await user.click(getFieldInputRoot());

    expect(screen.getByRole('dialog')).not.to.equal(null);
    expect(screen.queryByRole('tooltip')).to.equal(null);

    window.matchMedia = originalMatchMedia;
  });
});

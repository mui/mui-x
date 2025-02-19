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
  const { render } = createPickerRenderer();

  const { renderWithProps } = buildFieldInteractions({
    render,
    Component: DateRangePicker,
  });

  it('should not open mobile picker dialog when clicked on input with accessible DOM structure', async () => {
    const { user } = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    await user.click(getFieldInputRoot());

    expect(screen.queryByRole('tooltip')).not.to.equal(null);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('should not open mobile picker dialog when clicked on input with non-accessible DOM structure', async () => {
    const { user } = renderWithProps({ enableAccessibleFieldDOMStructure: false });
    await user.click(screen.getAllByRole('textbox')[0]);

    expect(screen.queryByRole('tooltip')).not.to.equal(null);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('should open mobile picker dialog when clicked on input when `useMediaQuery` returns `false`', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    const { user } = render(<DateRangePicker />);
    await user.click(getFieldInputRoot());

    expect(screen.getByRole('dialog')).not.to.equal(null);
    expect(screen.queryByRole('tooltip')).to.equal(null);

    window.matchMedia = originalMatchMedia;
  });
});

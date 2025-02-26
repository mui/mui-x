import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { screen } from '@mui/internal-test-utils/createRenderer';
import { expect } from 'chai';
import {
  buildFieldInteractions,
  createPickerRenderer,
  openPicker,
  stubMatchMedia,
} from 'test/utils/pickers';
import { pickerPopperClasses } from '@mui/x-date-pickers/internals/components/PickerPopper';

describe('<DateRangePicker />', () => {
  const { render } = createPickerRenderer();

  const { renderWithProps } = buildFieldInteractions({
    render,
    Component: DateRangePicker,
  });

  it('should not use the mobile picker by default with accessible DOM structure', async () => {
    const { user } = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).to.have.class(pickerPopperClasses.root);
    await user.keyboard('[Escape]');
  });

  it('should not use the mobile picker by default with non-accessible DOM structure', async () => {
    const { user } = renderWithProps({ enableAccessibleFieldDOMStructure: false });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).to.have.class(pickerPopperClasses.root);
    await user.keyboard('[Escape]');
  });

  it('should use the mobile picker when `useMediaQuery` returns `false` with accessible DOM structure', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    // Test with accessible DOM structure
    const { user } = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).not.to.have.class(pickerPopperClasses.root);
    await user.keyboard('[Escape]');

    window.matchMedia = originalMatchMedia;
  });

  it('should use the mobile picker when `useMediaQuery` returns `false` with non-accessible DOM structure', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    // Test with non-accessible DOM structure
    const { user } = renderWithProps({ enableAccessibleFieldDOMStructure: false });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).not.to.have.class(pickerPopperClasses.root);
    await user.keyboard('[Escape]');

    window.matchMedia = originalMatchMedia;
  });
});

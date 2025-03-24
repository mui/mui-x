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

  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should not use the mobile picker by default', () => {
    // Test with accessible DOM structure
    window.matchMedia = stubMatchMedia(true);
    const { unmount } = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).to.have.class(pickerPopperClasses.root);

    unmount();

    // Test with non-accessible DOM structure
    window.matchMedia = stubMatchMedia(true);
    renderWithProps({ enableAccessibleFieldDOMStructure: false });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).to.have.class(pickerPopperClasses.root);
  });

  it('should use the mobile picker when `useMediaQuery` returns `false`', () => {
    // Test with accessible DOM structure
    window.matchMedia = stubMatchMedia(false);
    const { unmount } = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).not.to.have.class(pickerPopperClasses.root);

    unmount();

    // Test with non-accessible DOM structure
    window.matchMedia = stubMatchMedia(false);
    renderWithProps({ enableAccessibleFieldDOMStructure: false });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).not.to.have.class(pickerPopperClasses.root);
  });
});

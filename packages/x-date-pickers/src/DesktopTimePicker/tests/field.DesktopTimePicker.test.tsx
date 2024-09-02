import {
  createPickerRenderer,
  getTextbox,
  expectFieldPlaceholderV6,
  expectFieldValueV7,
  buildFieldInteractions,
} from 'test/utils/pickers';
import { DesktopTimePicker, DesktopTimePickerProps } from '@mui/x-date-pickers/DesktopTimePicker';

describe('<DesktopTimePicker /> - Field', () => {
  const { render, clock } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({
    clock,
    render,
    Component: DesktopTimePicker,
  });

  it('should pass the ampm prop to the field', () => {
    const view = renderWithProps(
      { enableAccessibleFieldDOMStructure: true as const, ampm: true },
      { componentFamily: 'picker' },
    );

    expectFieldValueV7(view.getSectionsContainer(), 'hh:mm aa');

    view.setProps({ ampm: false });
    expectFieldValueV7(view.getSectionsContainer(), 'hh:mm');
  });

  it('should adapt the default field format based on the props of the picker', () => {
    const testFormat = (props: DesktopTimePickerProps<any, any>, expectedFormat: string) => {
      // Test with v7 input
      let view = renderWithProps(
        { ...props, enableAccessibleFieldDOMStructure: true as const },
        { componentFamily: 'picker' },
      );
      expectFieldValueV7(view.getSectionsContainer(), expectedFormat);
      view.unmount();

      // Test with v6 input
      view = renderWithProps(
        { ...props, enableAccessibleFieldDOMStructure: false as const },
        { componentFamily: 'picker' },
      );
      const input = getTextbox();
      expectFieldPlaceholderV6(input, expectedFormat);
      view.unmount();
    };

    testFormat({ views: ['hours'], ampm: false }, 'hh');
    testFormat({ views: ['hours'], ampm: true }, 'hh aa');
    testFormat({ views: ['minutes'] }, 'mm');
    testFormat({ views: ['seconds'] }, 'ss');
    testFormat({ views: ['hours', 'minutes'], ampm: false }, 'hh:mm');
    testFormat({ views: ['hours', 'minutes'], ampm: true }, 'hh:mm aa');
    testFormat({ views: ['minutes', 'seconds'] }, 'mm:ss');
    testFormat({ views: ['hours', 'minutes', 'seconds'], ampm: false }, 'hh:mm:ss');
    testFormat({ views: ['hours', 'minutes', 'seconds'], ampm: true }, 'hh:mm:ss aa');
  });
});

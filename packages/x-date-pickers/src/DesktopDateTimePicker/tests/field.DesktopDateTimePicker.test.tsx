import {
  createPickerRenderer,
  getTextbox,
  expectFieldPlaceholderV6,
  expectFieldValueV7,
  buildFieldInteractions,
} from 'test/utils/pickers';
import {
  DesktopDateTimePicker,
  DesktopDateTimePickerProps,
} from '@mui/x-date-pickers/DesktopDateTimePicker';

describe('<DesktopDateTimePicker /> - Field', () => {
  const { render, clock } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({
    clock,
    render,
    Component: DesktopDateTimePicker,
  });

  it('should pass the ampm prop to the field', () => {
    const v7Response = renderWithProps({
      enableAccessibleFieldDOMStructure: true as const,
      ampm: true,
    });

    expectFieldValueV7(v7Response.getSectionsContainer(), 'MM/DD/YYYY hh:mm aa');

    v7Response.setProps({ ampm: false });
    expectFieldValueV7(v7Response.getSectionsContainer(), 'MM/DD/YYYY hh:mm');
  });

  it('should adapt the default field format based on the props of the picker', () => {
    const testFormat = (props: DesktopDateTimePickerProps<any, any>, expectedFormat: string) => {
      // Test with v7 input
      const v7Response = renderWithProps(
        { ...props, enableAccessibleFieldDOMStructure: true as const },
        { componentFamily: 'picker' },
      );
      expectFieldValueV7(v7Response.getSectionsContainer(), expectedFormat);
      v7Response.unmount();

      // Test with v6 input
      const v6Response = renderWithProps(
        { ...props, enableAccessibleFieldDOMStructure: false as const },
        { componentFamily: 'picker' },
      );
      const input = getTextbox();
      expectFieldPlaceholderV6(input, expectedFormat);
      v6Response.unmount();
    };

    testFormat({ views: ['day', 'hours', 'minutes'], ampm: false }, 'DD hh:mm');
    testFormat({ views: ['day', 'hours', 'minutes'], ampm: true }, 'DD hh:mm aa');
    testFormat({ views: ['day', 'hours', 'minutes', 'seconds'], ampm: false }, 'DD hh:mm:ss');
    testFormat({ views: ['day', 'hours', 'minutes', 'seconds'], ampm: true }, 'DD hh:mm:ss aa');
    testFormat(
      { views: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'], ampm: false },
      'MM/DD/YYYY hh:mm:ss',
    );
    testFormat(
      { views: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'], ampm: true },
      'MM/DD/YYYY hh:mm:ss aa',
    );
  });
});

import { createPickerRenderer, expectFieldValue, buildFieldInteractions } from 'test/utils/pickers';
import { DesktopTimePicker, DesktopTimePickerProps } from '@mui/x-date-pickers/DesktopTimePicker';

describe('<DesktopTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({
    render,
    Component: DesktopTimePicker,
  });

  it('should pass the ampm prop to the field', () => {
    const view = renderWithProps({ ampm: true }, { componentFamily: 'picker' });

    expectFieldValue(view.getSectionsContainer(), 'hh:mm aa');

    view.setProps({ ampm: false });
    expectFieldValue(view.getSectionsContainer(), 'hh:mm');
  });

  it('should adapt the default field format based on the props of the picker', () => {
    const testFormat = (props: DesktopTimePickerProps, expectedFormat: string) => {
      const view = renderWithProps({ ...props }, { componentFamily: 'picker' });
      expectFieldValue(view.getSectionsContainer(), expectedFormat);
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

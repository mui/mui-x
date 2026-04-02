import {
  createPickerRenderer,
  expectFieldValueV7,
  buildFieldInteractions,
} from 'test/utils/pickers';
import {
  DesktopDateTimePicker,
  DesktopDateTimePickerProps,
} from '@mui/x-date-pickers/DesktopDateTimePicker';

describe('<DesktopDateTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({
    render,
    Component: DesktopDateTimePicker,
  });

  it('should pass the ampm prop to the field', () => {
    const view = renderWithProps({
      ampm: true,
    });

    expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY hh:mm aa');

    view.setProps({ ampm: false });
    expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY hh:mm');
  });

  it('should adapt the default field format based on the props of the picker', () => {
    const testFormat = (props: DesktopDateTimePickerProps, expectedFormat: string) => {
      const view = renderWithProps({ ...props }, { componentFamily: 'picker' });
      expectFieldValueV7(view.getSectionsContainer(), expectedFormat);
      view.unmount();
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

import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { createPickerRenderer, expectFieldValue, buildFieldInteractions } from 'test/utils/pickers';

describe('<MobileDateTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({
    render,
    Component: MobileDateTimePicker,
  });

  it('should pass the ampm prop to the field', () => {
    const view = renderWithProps({
      ampm: true,
    });

    expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY hh:mm aa');

    view.setProps({ ampm: false });
    expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY hh:mm');
  });
});

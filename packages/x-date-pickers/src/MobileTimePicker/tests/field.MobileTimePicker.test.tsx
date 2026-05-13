import { createPickerRenderer, buildFieldInteractions, expectFieldValue } from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

describe('<MobileTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({
    render,
    Component: MobileTimePicker,
  });

  it('should pass the ampm prop to the field', () => {
    const view = renderWithProps({ ampm: true }, { componentFamily: 'picker' });

    expectFieldValue(view.getSectionsContainer(), 'hh:mm aa');

    view.setProps({ ampm: false });
    expectFieldValue(view.getSectionsContainer(), 'hh:mm');
  });
});

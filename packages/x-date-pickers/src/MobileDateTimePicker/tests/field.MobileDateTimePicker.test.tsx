import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import {
  createPickerRenderer,
  expectFieldValueV7,
  buildFieldInteractions,
} from 'test/utils/pickers';

describe('<MobileDateTimePicker /> - Field', () => {
  const { render, clock } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({
    clock,
    render,
    Component: MobileDateTimePicker,
  });

  it('should pass the ampm prop to the field', () => {
    const view = renderWithProps({
      enableAccessibleFieldDOMStructure: true as const,
      ampm: true,
    });

    expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY hh:mm aa');

    view.setProps({ ampm: false });
    expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY hh:mm');
  });
});

import {
  createPickerRenderer,
  buildFieldInteractions,
  expectFieldValueV7,
} from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

describe('<MobileTimePicker /> - Field', () => {
  const { render, clock } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({
    render,
    clock,
    Component: MobileTimePicker,
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
});

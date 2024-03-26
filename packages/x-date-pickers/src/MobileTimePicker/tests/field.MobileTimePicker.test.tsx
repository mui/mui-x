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
    const v7Response = renderWithProps(
      { enableAccessibleFieldDOMStructure: true as const, ampm: true },
      { componentFamily: 'picker' },
    );

    expectFieldValueV7(v7Response.getSectionsContainer(), 'hh:mm aa');

    v7Response.setProps({ ampm: false });
    expectFieldValueV7(v7Response.getSectionsContainer(), 'hh:mm');
  });
});

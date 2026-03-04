import { DateField } from '@mui/x-date-pickers/DateField';
import { describeAdapters, getTextbox, getFieldInputRoot } from 'test/utils/pickers';
import { fireEvent } from '@mui/internal-test-utils';

// Tests that on blur, partially filled fields are considered invalid
// while completely empty or fully valid fields remain not invalid.

describeAdapters(
  'DateField - partial filling on blur',
  DateField,
  ({ adapter, renderWithProps }) => {
    it('marks field invalid on blur when only some sections are filled (accessible DOM)', async () => {
      const view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      await view.selectSection('month');
      await view.user.keyboard('0');
      await view.user.keyboard('1');

      const fieldRoot = getFieldInputRoot();

      // While focused and partially filled, it should not be invalid yet
      expect(fieldRoot).to.have.attribute('aria-invalid', 'false');

      // Blur the sections container to trigger validation in accessible DOM
      await view.user.tab();

      expect(fieldRoot).to.have.attribute('aria-invalid', 'true');
    });

    it('does not mark invalid on blur when all sections are empty (accessible DOM)', async () => {
      const view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      // Focus a section then blur without typing
      await view.selectSection('month');
      await view.user.tab();

      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
    });

    it('does not mark invalid on blur when value is fully valid (accessible DOM)', async () => {
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date('2025-01-15'),
      });

      // Focus and blur
      await view.selectSection('month');
      await view.user.tab();

      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
    });

    it('marks field invalid on blur when only some sections are filled (non-accessible DOM)', async () => {
      const view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      await view.selectSection('month');
      const input = getTextbox();

      // Partially fill the month: "01/DD/YYYY"
      fireEvent.change(input, { target: { value: '01/DD/YYYY' } });

      expect(input).to.have.attribute('aria-invalid', 'false');

      // Blur the input in non-accessible DOM
      fireEvent.blur(input);

      expect(input).to.have.attribute('aria-invalid', 'true');
    });
  },
);

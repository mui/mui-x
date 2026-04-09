import { DateField } from '@mui/x-date-pickers/DateField';
import { describeAdapters, getFieldInputRoot } from 'test/utils/pickers';

// Tests that on blur, partially filled fields are considered invalid
// while completely empty or fully valid fields remain not invalid.

describeAdapters(
  'DateField - partial filling on blur',
  DateField,
  ({ adapter, renderWithProps }) => {
    it('marks field invalid on blur when only some sections are filled', async () => {
      const view = renderWithProps({});

      await view.selectSection('month');
      await view.user.keyboard('0');
      await view.user.keyboard('1');

      const fieldRoot = getFieldInputRoot();

      // While focused and partially filled, it should not be invalid yet
      expect(fieldRoot).to.have.attribute('aria-invalid', 'false');

      // Blur the sections container to trigger validation
      await view.user.tab();

      expect(fieldRoot).to.have.attribute('aria-invalid', 'true');
    });

    it('does not mark invalid on blur when all sections are empty', async () => {
      const view = renderWithProps({});

      // Focus a section then blur without typing
      await view.selectSection('month');
      await view.user.tab();

      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
    });

    it('does not mark invalid on blur when value is fully valid', async () => {
      const view = renderWithProps({
        defaultValue: adapter.date('2025-01-15'),
      });

      // Focus and blur
      await view.selectSection('month');
      await view.user.tab();

      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
    });
  },
);

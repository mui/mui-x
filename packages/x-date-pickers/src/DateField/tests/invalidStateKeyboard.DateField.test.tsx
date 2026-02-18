import { DateField } from '@mui/x-date-pickers/DateField';
import { describeAdapters, getTextbox, getFieldInputRoot } from 'test/utils/pickers';

// Regression: invalid state should not temporarily clear during keyboard spin when sections are still invalid
// Reproduction steps covered:
// 1. Type an invalid month ("00")
// 2. Move focus to the year section
// 3. Press ArrowUp/ArrowDown to spin year
// Expectation: aria-invalid remains true while the overall value is still invalid

describeAdapters(
  'DateField - sticky invalid state during keyboard spin',
  DateField,
  ({ renderWithProps }) => {
    it('keeps aria-invalid=true while spinning year when month is invalid (accessible DOM)', async () => {
      const view = renderWithProps({ enableAccessibleFieldDOMStructure: true }); // default format is numeric, e.g. MM/DD/YYYY

      // Make month invalid by typing "00"
      await view.selectSection('month');
      await view.user.keyboard('00');
      await view.user.tab();

      const inputRoot = getFieldInputRoot();

      // Should be invalid now
      expect(inputRoot).to.have.attribute('aria-invalid', 'true');

      await view.selectSection('day');

      // Returns to valid after refocusing (incomplete date)
      expect(inputRoot).to.have.attribute('aria-invalid', 'false');
      await view.user.keyboard('05');

      await view.selectSection('year');
      await view.user.keyboard('2025');

      // Should now be invalid
      expect(inputRoot).to.have.attribute('aria-invalid', 'true');

      // Spin using keypress
      await view.user.keyboard('[ArrowUp][ArrowUp][ArrowDown]');

      // Should still be invalid despite cycling 3 times, must not flash to valid between spins
      expect(inputRoot).to.have.attribute('aria-invalid', 'true');

      view.unmount();
    });

    it('keeps aria-invalid=true while spinning year when month is invalid (non-accessible DOM)', async () => {
      const view = renderWithProps({ enableAccessibleFieldDOMStructure: false }); // default format is numeric, e.g. MM/DD/YYYY

      await view.selectSection('month');
      const input = getTextbox();

      await view.selectSection('month');
      await view.user.keyboard('00');
      await view.user.tab();

      // Should be invalid now
      expect(input).to.have.attribute('aria-invalid', 'true');

      await view.selectSection('day');

      // Returns to valid after refocusing (incomplete date)
      expect(input).to.have.attribute('aria-invalid', 'false');
      await view.user.keyboard('05');

      // Move to year and spin using keypress
      await view.selectSection('year');
      await view.user.keyboard('2025');

      // Should now be invalid
      expect(input).to.have.attribute('aria-invalid', 'true');

      await view.user.keyboard('[ArrowUp][ArrowUp][ArrowDown]');
      await view.user.tab();

      // Should still be invalid despite cycling 3 times, must not flash to valid between spins
      expect(input).to.have.attribute('aria-invalid', 'true');

      view.unmount();
    });
  },
);

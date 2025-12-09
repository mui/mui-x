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
      await view.selectSectionAsync('month');
      await view.user.keyboard('00');
      await view.user.tab();

      // Should be invalid now
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      // Move to year and spin
      await view.selectSectionAsync('year');
      await view.user.keyboard('[ArrowUp][ArrowUp][ArrowDown]');
      await view.user.tab();

      // Still invalid, must not flash to valid between spins
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      view.unmount();
    });

    it('keeps aria-invalid=true while spinning year when month is invalid (non-accessible DOM)', async () => {
      const view = renderWithProps({ enableAccessibleFieldDOMStructure: false }); // default format is numeric, e.g. MM/DD/YYYY

      await view.selectSectionAsync('month');
      const input = getTextbox();

      await view.selectSectionAsync('month');
      await view.user.keyboard('0');
      await view.user.tab();

      expect(input).to.have.attribute('aria-invalid', 'true');

      // Move to year and spin using keypress
      await view.selectSectionAsync('year');
      await view.user.keyboard('[ArrowUp][ArrowUp][ArrowDown]');
      await view.user.tab();

      // Still invalid, must not flash to valid between spins
      expect(input).to.have.attribute('aria-invalid', 'true');

      view.unmount();
    });
  },
);

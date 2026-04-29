import { waitFor } from '@mui/internal-test-utils';
import { DateField } from '@mui/x-date-pickers/DateField';
import { describeAdapters, getFieldInputRoot } from 'test/utils/pickers';

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
    it('keeps aria-invalid=true while spinning year when month is invalid', async () => {
      const view = renderWithProps({}); // default format is numeric, e.g. MM/DD/YYYY

      // Make month invalid by typing "00"
      await view.selectSection('month');
      await view.user.keyboard('00');
      await view.user.tab();

      const inputRoot = getFieldInputRoot();

      // Should be invalid now
      await waitFor(() => {
        expect(inputRoot).to.have.attribute('aria-invalid', 'true');
      });

      await view.selectSection('day');

      // Returns to valid after refocusing (incomplete date)
      await waitFor(() => {
        expect(inputRoot).to.have.attribute('aria-invalid', 'false');
      });
      await view.user.keyboard('05');

      await view.selectSection('year');
      await view.user.keyboard('2025');

      // Should now be invalid
      await waitFor(() => {
        expect(inputRoot).to.have.attribute('aria-invalid', 'true');
      });

      // Spin using keypress
      await view.user.keyboard('[ArrowUp][ArrowUp][ArrowDown]');

      // Should still be invalid despite cycling 3 times, must not flash to valid between spins
      await waitFor(() => {
        expect(inputRoot).to.have.attribute('aria-invalid', 'true');
      });
    });
  },
);

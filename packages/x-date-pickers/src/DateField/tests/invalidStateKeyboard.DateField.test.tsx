import { DateField } from '@mui/x-date-pickers/DateField';
import { describeAdapters , getTextbox , getFieldInputRoot } from 'test/utils/pickers';
import { fireEvent } from '@mui/internal-test-utils';
import { fireUserEvent } from 'test/utils/fireUserEvent';

// Regression: invalid state should not temporarily clear during keyboard spin when sections are still invalid
// Reproduction steps covered:
// 1. Type an invalid month ("00")
// 2. Move focus to the year section
// 3. Press ArrowUp/ArrowDown to spin year
// Expectation: aria-invalid remains true while the overall value is still invalid

describeAdapters('DateField - sticky invalid state during keyboard spin', DateField, ({ renderWithProps }) => {
  it('keeps aria-invalid=true while spinning year when month is invalid (accessible DOM)', async () => {
    const view = renderWithProps({ enableAccessibleFieldDOMStructure: true }); // default format is numeric, e.g. MM/DD/YYYY

    // Make month invalid by typing "00"
    await view.selectSectionAsync('month');
    view.pressKey(0, '0');
    view.pressKey(0, '0');

    // Should be invalid now
    expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

    // Move to year and spin
    await view.selectSectionAsync('year');
    await view.user.keyboard('[ArrowUp][ArrowUp][ArrowDown]');

    // Still invalid, must not flash to valid between spins
    expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

    view.unmount();
  });

  it('keeps aria-invalid=true while spinning year when month is invalid (non-accessible DOM)', async () => {
    const view = renderWithProps({ enableAccessibleFieldDOMStructure: false }); // default format is numeric, e.g. MM/DD/YYYY

    await view.selectSectionAsync('month');
    const input = getTextbox();

    // Simulate typing into the month section to make it invalid: "00"
    // Replace placeholder for a month while keeping placeholders for the rest
    // Step 1: type single zero
    fireEvent.change(input, { target: { value: '0/DD/YYYY' } });
    // Step 2: type the second zero
    fireEvent.change(input, { target: { value: '00/DD/YYYY' } });

    expect(input).to.have.attribute('aria-invalid', 'true');

    // Move to year and spin using keypress
    await view.selectSectionAsync('year');
    fireUserEvent.keyPress(input, { key: 'ArrowUp' });
    fireUserEvent.keyPress(input, { key: 'ArrowDown' });

    expect(input).to.have.attribute('aria-invalid', 'true');

    view.unmount();
  });
});

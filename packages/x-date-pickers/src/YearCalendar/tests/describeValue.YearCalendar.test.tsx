import { expect } from 'chai';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { createPickerRenderer, adapterToUse, describeValue } from 'test/utils/pickers';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<YearCalendar /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'calendar'>(YearCalendar, () => ({
    render,
    componentFamily: 'calendar',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-01')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const activeYear = screen
        .queryAllByRole('radio')
        .find((cell) => cell.getAttribute('tabindex') === '0');
      expect(activeYear).not.to.equal(null);
      if (expectedValue == null) {
        expect(activeYear).to.have.text(adapterToUse.getYear(adapterToUse.date()).toString());
      } else {
        expect(activeYear).to.have.text(adapterToUse.getYear(expectedValue).toString());
        expect(activeYear).to.have.attribute('aria-checked', 'true');
      }
    },
    setNewValue: async (value) => {
      const newValue = adapterToUse.addYears(value!, 1);
      fireEvent.click(
        screen.getByRole('radio', { name: adapterToUse.getYear(newValue).toString() }),
      );

      return newValue;
    },
  }));
});

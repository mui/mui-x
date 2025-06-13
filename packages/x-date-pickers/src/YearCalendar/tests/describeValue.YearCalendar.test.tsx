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
        .find((cell) => cell.getAttribute('aria-checked') === 'true');

      if (expectedValue == null) {
        expect(activeYear).to.equal(undefined);
      } else {
        expect(activeYear).not.to.equal(undefined);
        expect(activeYear).to.have.text(adapterToUse.getYear(expectedValue).toString());
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addYears(value!, 1);
      fireEvent.click(
        screen.getByRole('radio', { name: adapterToUse.getYear(newValue).toString() }),
      );

      return newValue;
    },
  }));
});

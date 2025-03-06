import { expect } from 'chai';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { createPickerRenderer, adapterToUse, describeValue } from 'test/utils/pickers';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<MonthCalendar /> - Describe Value', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValue<PickerValue, 'calendar'>(MonthCalendar, () => ({
    render,
    clock,
    componentFamily: 'calendar',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-02-01')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const activeMonth = screen
        .queryAllByRole('radio')
        .find((cell) => cell.getAttribute('tabindex') === '0');
      expect(activeMonth).not.to.equal(null);
      if (expectedValue == null) {
        expect(activeMonth).to.have.text(
          adapterToUse.format(adapterToUse.date(), 'monthShort').toString(),
        );
      } else {
        expect(activeMonth).to.have.text(
          adapterToUse.format(expectedValue, 'monthShort').toString(),
        );
        expect(activeMonth).to.have.attribute('aria-checked', 'true');
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addMonths(value!, 1);

      fireEvent.click(screen.getByRole('radio', { name: adapterToUse.format(newValue, 'month') }));

      return newValue;
    },
  }));
});

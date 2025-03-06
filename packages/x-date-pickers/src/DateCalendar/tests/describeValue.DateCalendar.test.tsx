import { expect } from 'chai';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { pickersDayClasses } from '@mui/x-date-pickers/PickersDay';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { adapterToUse, createPickerRenderer, describeValue } from 'test/utils/pickers';

describe('<DateCalendar /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'calendar'>(DateCalendar, () => ({
    render,
    componentFamily: 'calendar',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const selectedCells = document.querySelectorAll(`.${pickersDayClasses.selected}`);
      if (expectedValue == null) {
        expect(selectedCells).to.have.length(0);
      } else {
        expect(selectedCells).to.have.length(1);
        expect(selectedCells[0]).to.have.text(adapterToUse.getDate(expectedValue).toString());
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addDays(value!, 1);
      fireEvent.click(
        screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
      );

      return newValue;
    },
  }));
});

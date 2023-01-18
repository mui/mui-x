import { screen, userEvent } from '@mui/monorepo/test/utils';
import { Unstable_DesktopNextDateRangePicker as DesktopNextDateRangePicker } from '@mui/x-date-pickers-pro/DesktopNextDateRangePicker';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  adapterToUse,
  buildFieldInteractions,
  createPickerRenderer,
  expectInputValue,
} from 'test/utils/pickers-utils';

describe('<DesktopNextDateRangePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  const { clickOnInput } = buildFieldInteractions({ clock });

  describeRangeValidation(DesktopNextDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'new-picker',
    views: ['day'],
  }));

  describeValue(DesktopNextDateRangePicker, () => ({
    render,
    componentFamily: 'new-picker',
    type: 'date-range',
    variant: 'desktop',
    initialFocus: 'start',
    clock,
    values: [
      // initial start and end dates
      [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 4))],
      // start and end dates after `setNewValue`
      [adapterToUse.date(new Date(2018, 0, 2)), adapterToUse.date(new Date(2018, 0, 5))],
    ],
    emptyValue: [null, null],
    assertRenderedValue: (expectedValues: any[]) => {
      const textBoxes = screen.getAllByRole('textbox');
      expectedValues.forEach((value, index) => {
        const expectedValueStr =
          value == null ? 'MM/DD/YYYY' : adapterToUse.format(value, 'keyboardDate');
        // TODO: Support single range input
        expectInputValue(textBoxes[index], expectedValueStr, true);
      });
    },
    setNewValue: (value, { isOpened, applySameValue, setEndDate = false } = {}) => {
      let newValue: any[];
      if (applySameValue) {
        newValue = value;
      } else if (setEndDate) {
        newValue = [value[0], adapterToUse.addDays(value[1], 1)];
      } else {
        newValue = [adapterToUse.addDays(value[0], 1), value[1]];
      }

      if (isOpened) {
        userEvent.mousePress(
          screen.getAllByRole('gridcell', {
            name: adapterToUse.getDate(newValue[setEndDate ? 1 : 0]),
          })[0],
        );
      } else {
        const input = screen.getAllByRole('textbox')[0];
        clickOnInput(input, 9, 11); // Update the day
        userEvent.keyPress(input, { key: 'ArrowUp' });
      }

      return newValue;
    },
  }));
});

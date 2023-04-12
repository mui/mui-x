import { screen, userEvent, fireDiscreteEvent } from '@mui/monorepo/test/utils';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  adapterToUse,
  createPickerRenderer,
  expectInputPlaceholder,
  expectInputValue,
  openPicker,
} from 'test/utils/pickers-utils';

describe('<MobileDateRangePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describeRangeValidation(MobileDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'picker',
    views: ['day'],
    variant: 'mobile',
  }));

  describeValue(MobileDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-range',
    variant: 'mobile',
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
      // `getAllByRole('textbox')` does not work here, because inputs are `readonly`
      const textBoxes: HTMLInputElement[] = [
        screen.getByLabelText('Start'),
        screen.getByLabelText('End'),
      ];
      expectedValues.forEach((value, index) => {
        const input = textBoxes[index];
        // TODO: Support single range input
        if (!value) {
          expectInputPlaceholder(input, 'MM/DD/YYYY');
        }
        expectInputValue(input, value ? adapterToUse.format(value, 'keyboardDate') : '');
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

      if (!isOpened) {
        openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });
      }

      userEvent.mousePress(
        screen.getAllByRole('gridcell', {
          name: adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
        })[0],
      );

      // Close the picker
      if (!isOpened) {
        fireDiscreteEvent.keyDown(document.activeElement!, { key: 'Escape' });
        clock.runToLast();
      }

      return newValue;
    },
  }));
});

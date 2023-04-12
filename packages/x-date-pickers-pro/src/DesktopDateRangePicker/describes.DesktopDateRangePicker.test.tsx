import { screen, userEvent } from '@mui/monorepo/test/utils';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  adapterToUse,
  buildFieldInteractions,
  createPickerRenderer,
  expectInputPlaceholder,
  expectInputValue,
} from 'test/utils/pickers-utils';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

describe('<DesktopDateRangePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  const { clickOnInput } = buildFieldInteractions({
    clock,
    render,
    Component: DesktopDateRangePicker,
  });

  describeRangeValidation(DesktopDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'picker',
    views: ['day'],
  }));

  describeValue(DesktopDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
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
      const textBoxes: HTMLInputElement[] = screen.getAllByRole('textbox');
      expectedValues.forEach((value, index) => {
        const input = textBoxes[index];
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

      if (isOpened) {
        userEvent.mousePress(
          screen.getAllByRole('gridcell', {
            name: adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
          })[0],
        );
      } else {
        const input = screen.getAllByRole<HTMLInputElement>('textbox')[0];
        clickOnInput(input, 5); // Update the day
        userEvent.keyPress(input, { key: 'ArrowUp' });
      }

      return newValue;
    },
  }));

  // With single input field
  describeValue(DesktopDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-range',
    variant: 'desktop',
    initialFocus: 'start',
    isSingleInput: true,
    defaultProps: {
      slots: { field: SingleInputDateRangeField },
    },
    clock,
    values: [
      // initial start and end dates
      [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 4))],
      // start and end dates after `setNewValue`
      [adapterToUse.date(new Date(2018, 0, 2)), adapterToUse.date(new Date(2018, 0, 5))],
    ],
    emptyValue: [null, null],
    assertRenderedValue: (expectedValues: any[]) => {
      const input = screen.getByRole<HTMLInputElement>('textbox');
      const expectedValueStr = expectedValues
        .map((value) => (value == null ? 'MM/DD/YYYY' : adapterToUse.format(value, 'keyboardDate')))
        .join(' – ');

      const isEmpty = expectedValues[0] == null && expectedValues[1] == null;

      if (isEmpty) {
        expectInputPlaceholder(input, expectedValueStr);
      }

      expectInputValue(input, isEmpty ? '' : expectedValueStr);
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
            name: adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
          })[0],
        );
      } else {
        const input = screen.getByRole<HTMLInputElement>('textbox');
        clickOnInput(input, 5); // Update the day
        userEvent.keyPress(input, { key: 'ArrowUp' });
      }

      return newValue;
    },
  }));
});

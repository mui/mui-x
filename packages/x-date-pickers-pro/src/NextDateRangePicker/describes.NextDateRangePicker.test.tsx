import * as React from 'react';
import { describeConformance, screen, userEvent } from '@mui/monorepo/test/utils';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  adapterToUse,
  buildFieldInteractions,
  createPickerRenderer,
  expectInputValue,
  wrapPickerMount,
} from 'test/utils/pickers-utils';

describe('<NextDateRangePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const { clickOnInput } = buildFieldInteractions({ clock });

  describeConformance(<NextDateRangePicker />, () => ({
    classes: {},
    muiName: 'MuiDateRangePicker',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
      'rootClass',
      'reactTestRenderer',
    ],
  }));

  describeRangeValidation(NextDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'new-picker',
    views: ['day'],
  }));

  describeValue(NextDateRangePicker, () => ({
    render,
    componentFamily: 'new-picker',
    type: 'date-range',
    variant: 'desktop',
    initialFocus: 'start',
    values: [
      // initial start and end dates
      [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
      // start and end dates after `setNewValue`
      [adapterToUse.date(new Date(2018, 0, 2)), adapterToUse.date(new Date(2018, 0, 3))],
    ],
    emptyValue: [null, null],
    assertRenderedValue: (expectedValues: any[]) => {
      expectedValues.forEach((value, index) => {
        const expectedValueStr =
          value == null ? 'MM/DD/YYYY' : adapterToUse.format(value, 'keyboardDate');
        // TODO: Support single range input
        expectInputValue(screen.getAllByRole('textbox')[index], expectedValueStr, true);
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
        clickOnInput(input, 5); // Update the day
        userEvent.keyPress(input, { key: 'ArrowUp' });
      }

      return newValue;
    },
  }));
});

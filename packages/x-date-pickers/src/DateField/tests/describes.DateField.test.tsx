import * as React from 'react';
import { describeConformance, screen, userEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import { DateField } from '@mui/x-date-pickers/DateField';
import {
  createPickerRenderer,
  wrapPickerMount,
  adapterToUse,
  expectInputValue,
  buildFieldInteractions,
} from 'test/utils/pickers-utils';

describe('<DateField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const { clickOnInput } = buildFieldInteractions({ clock });

  describeConformance(<DateField />, () => ({
    classes: {},
    inheritComponent: 'div',
    render,
    muiName: 'MuiDateField',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: [
      'reactTestRenderer',
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
    ],
  }));

  describeValidation(DateField, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'field',
  }));

  describeValue(DateField, () => ({
    render,
    componentFamily: 'field',
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const expectedValueStr =
        expectedValue == null ? 'MM/DD/YYYY' : adapterToUse.format(expectedValue, 'keyboardDate');
      expectInputValue(screen.getByRole('textbox'), expectedValueStr, true);
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addDays(value, 1);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 10); // Update the day
      userEvent.keyPress(input, { key: 'ArrowUp' });
      return newValue;
    },
  }));
});

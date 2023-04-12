import * as React from 'react';
import { describeConformance, userEvent } from '@mui/monorepo/test/utils';
import TextField from '@mui/material/TextField';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import { DateField } from '@mui/x-date-pickers/DateField';
import {
  createPickerRenderer,
  wrapPickerMount,
  adapterToUse,
  expectInputValue,
  buildFieldInteractions,
  getTextbox,
  expectInputPlaceholder,
} from 'test/utils/pickers-utils';

describe('<DateField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const { clickOnInput } = buildFieldInteractions({ clock, render, Component: DateField });

  describeConformance(<DateField />, () => ({
    classes: {} as any,
    inheritComponent: TextField,
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
      const input = getTextbox();
      if (!expectedValue) {
        expectInputPlaceholder(input, 'MM/DD/YYYY');
      }
      expectInputValue(
        input,
        expectedValue ? adapterToUse.format(expectedValue, 'keyboardDate') : '',
      );
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addDays(value, 1);
      const input = getTextbox();
      clickOnInput(input, 5); // Update the day
      userEvent.keyPress(input, { key: 'ArrowUp' });
      return newValue;
    },
  }));
});

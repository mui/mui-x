import * as React from 'react';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import TextField from '@mui/material/TextField';
import { describeConformance, userEvent } from '@mui/monorepo/test/utils';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import {
  adapterToUse,
  createPickerRenderer,
  wrapPickerMount,
  expectInputValue,
  expectInputPlaceholder,
  getTextbox,
} from 'test/utils/pickers';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';

describe('<DateTimeField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DateTimeField, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'field',
  }));

  describeConformance(<DateTimeField />, () => ({
    classes: {} as any,
    inheritComponent: TextField,
    render,
    muiName: 'MuiDateTimeField',
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

  describeValue(DateTimeField, () => ({
    render,
    componentFamily: 'field',
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const input = getTextbox();
      if (!expectedValue) {
        expectInputPlaceholder(input, hasMeridiem ? 'MM/DD/YYYY hh:mm aa' : 'MM/DD/YYYY hh:mm');
      }
      const expectedValueStr = expectedValue
        ? adapterToUse.format(
            expectedValue,
            hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h',
          )
        : '';

      expectInputValue(input, expectedValueStr);
    },
    setNewValue: (value, { selectSection }) => {
      const newValue = adapterToUse.addDays(value, 1);
      selectSection('day');
      const input = getTextbox();
      userEvent.keyPress(input, { key: 'ArrowUp' });
      return newValue;
    },
  }));
});

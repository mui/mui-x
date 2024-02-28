import * as React from 'react';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { DateField } from '@mui/x-date-pickers/DateField';
import {
  createPickerRenderer,
  wrapPickerMount,
  expectFieldValueV7,
  adapterToUse,
  describeValidation,
  describeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DateField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DateField, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'field',
  }));

  describeConformance(<DateField enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    inheritComponent: PickersTextField,
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

  describeValue(DateField, () => ({
    render,
    componentFamily: 'field',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const fieldRoot = getFieldInputRoot();

      const expectedValueStr = expectedValue
        ? adapterToUse.format(expectedValue, 'keyboardDate')
        : 'MM/DD/YYYY';

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (value, { selectSection, pressKey }) => {
      const newValue = adapterToUse.addDays(value, 1);
      selectSection('day');
      pressKey(undefined, 'ArrowUp');

      return newValue;
    },
  }));
});

import * as React from 'react';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { DateField } from '@mui/x-date-pickers/DateField';
import {
  createPickerRenderer,
  expectFieldValueV7,
  adapterToUse,
  describeValidation,
  describeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DateField /> - Describes', () => {
  const { render, clock } = createPickerRenderer();

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
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
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
    setNewValue: async (value, { selectSection, pressKey }) => {
      const newValue = adapterToUse.addDays(value, 1);
      await selectSection('day');
      await pressKey('ArrowUp');

      return newValue;
    },
  }));
});

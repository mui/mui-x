import * as React from 'react';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import {
  adapterToUse,
  createPickerRenderer,
  expectFieldValueV7,
  describeValidation,
  describeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DateTimeField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DateTimeField, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'field',
  }));

  describeConformance(<DateTimeField enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    inheritComponent: PickersTextField,
    render,
    muiName: 'MuiDateTimeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
  }));

  describeValue(DateTimeField, () => ({
    render,
    componentFamily: 'field',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const fieldRoot = getFieldInputRoot();

      let expectedValueStr: string;
      if (expectedValue) {
        expectedValueStr = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h',
        );
      } else {
        expectedValueStr = hasMeridiem ? 'MM/DD/YYYY hh:mm aa' : 'MM/DD/YYYY hh:mm';
      }

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

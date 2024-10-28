import * as React from 'react';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import {
  adapterToUse,
  createPickerRenderer,
  describeRangeValidation,
  setValueOnFieldInput,
} from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MultiInputDateRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<MultiInputDateRangeField />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputDateRangeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['themeVariants', 'componentProp', 'componentsProp'],
  }));

  describeRangeValidation(MultiInputDateRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['year', 'month', 'day'],
    setValue: (value, { setEndDate } = {}) => {
      setValueOnFieldInput(adapterToUse.format(value, 'keyboardDate'), setEndDate ? 1 : 0);
    },
  }));
});

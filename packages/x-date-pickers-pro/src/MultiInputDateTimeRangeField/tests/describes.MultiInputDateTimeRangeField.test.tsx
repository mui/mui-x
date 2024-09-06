import * as React from 'react';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import {
  adapterToUse,
  createPickerRenderer,
  describeRangeValidation,
  setValueOnFieldInput,
} from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MultiInputDateTimeRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<MultiInputDateTimeRangeField enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputDateTimeRangeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));

  describeRangeValidation(MultiInputDateTimeRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    setValue: (value, { setEndDate } = {}) => {
      setValueOnFieldInput(adapterToUse.format(value, 'keyboardDateTime'), setEndDate ? 1 : 0);
    },
  }));
});

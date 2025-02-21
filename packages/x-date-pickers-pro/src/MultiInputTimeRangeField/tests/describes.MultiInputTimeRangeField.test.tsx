import * as React from 'react';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import {
  adapterToUse,
  createPickerRenderer,
  describeRangeValidation,
  setValueOnFieldInput,
} from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MultiInputTimeRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<MultiInputTimeRangeField />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputTimeRangeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['themeVariants', 'componentProp', 'componentsProp'],
  }));

  describeRangeValidation(MultiInputTimeRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['hours', 'minutes'],
    fieldType: 'multi-input',
    setValue: (value, { setEndDate } = {}) => {
      setValueOnFieldInput(
        adapterToUse.format(
          value,
          adapterToUse.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h',
        ),
        setEndDate ? 1 : 0,
      );
    },
  }));
});

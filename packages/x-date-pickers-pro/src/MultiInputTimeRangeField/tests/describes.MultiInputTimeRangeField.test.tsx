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
  const { render } = createPickerRenderer({
    clockConfig: new Date(2018, 0, 10),
    clockOptions: { toFake: ['Date'] },
  });

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
    setValue: (value, { setEndDate } = {}) => {
      setValueOnFieldInput(adapterToUse.format(value, 'fullTime'), setEndDate ? 1 : 0);
    },
  }));
});

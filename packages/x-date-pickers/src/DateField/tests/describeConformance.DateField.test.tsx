import * as React from 'react';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { DateField } from '@mui/x-date-pickers/DateField';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DateField /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DateField />, () => ({
    classes: {} as any,
    inheritComponent: PickersTextField,
    render,
    muiName: 'MuiDateField',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
  }));
});

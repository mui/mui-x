import * as React from 'react';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DateTimeField /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DateTimeField />, () => ({
    classes: {} as any,
    inheritComponent: PickersTextField,
    render,
    muiName: 'MuiDateTimeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
  }));
});

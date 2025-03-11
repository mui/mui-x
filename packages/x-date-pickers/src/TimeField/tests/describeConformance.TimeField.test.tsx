import * as React from 'react';
import { createPickerRenderer } from 'test/utils/pickers';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { describeConformance } from 'test/utils/describeConformance';

describe('<TimeField /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<TimeField />, () => ({
    classes: {} as any,
    inheritComponent: PickersTextField,
    render,
    muiName: 'MuiTimeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
  }));
});

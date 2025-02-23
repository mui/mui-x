import * as React from 'react';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<SingleInputDateRangeField /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<SingleInputDateRangeField />, () => ({
    classes: {} as any,
    inheritComponent: PickersTextField,
    render,
    muiName: 'MuiSingleInputDateRangeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
  }));
});

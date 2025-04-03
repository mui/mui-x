import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DatePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DatePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDatePicker',
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
    ],
  }));
});

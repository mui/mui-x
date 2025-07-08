import * as React from 'react';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<StaticDatePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(StaticDatePicker, { render, fieldType: 'single-input', variant: 'static' });

  describeConformance(<StaticDatePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiStaticDatePicker',
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

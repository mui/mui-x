import * as React from 'react';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<StaticDateTimePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(StaticDateTimePicker, { render, fieldType: 'single-input', variant: 'static' });

  describeConformance(<StaticDateTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiStaticDateTimePicker',
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

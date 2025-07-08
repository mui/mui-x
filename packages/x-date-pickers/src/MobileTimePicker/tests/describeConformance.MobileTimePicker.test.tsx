import * as React from 'react';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MobileTimePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(MobileTimePicker, { render, fieldType: 'single-input', variant: 'mobile' });

  describeConformance(<MobileTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileTimePicker',
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

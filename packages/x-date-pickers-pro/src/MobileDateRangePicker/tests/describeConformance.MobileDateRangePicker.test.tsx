import * as React from 'react';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MobileDateRangePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(MobileDateRangePicker, { render, fieldType: 'multi-input', variant: 'mobile' });

  describeConformance(<MobileDateRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileDateRangePicker',
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

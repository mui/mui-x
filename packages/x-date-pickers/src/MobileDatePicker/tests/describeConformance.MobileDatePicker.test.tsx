import * as React from 'react';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MobileDatePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(MobileDatePicker, { render, fieldType: 'single-input', variant: 'mobile' });

  describeConformance(<MobileDatePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileDatePicker',
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

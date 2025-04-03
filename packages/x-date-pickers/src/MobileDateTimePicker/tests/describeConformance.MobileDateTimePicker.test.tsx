import * as React from 'react';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MobileDateTimePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(MobileDateTimePicker, { render, fieldType: 'single-input', variant: 'mobile' });

  describeConformance(<MobileDateTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileDateTimePicker',
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

import * as React from 'react';
import { describeConformance } from '@mui/internal-test-utils';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { MobileDateTimeRangePicker } from '@mui/x-date-pickers-pro/MobileDateTimeRangePicker';

describe('<MobileDateTimeRangePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(MobileDateTimeRangePicker, {
    render,
    fieldType: 'multi-input',
    variant: 'mobile',
  });

  describeConformance(<MobileDateTimeRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileDateTimeRangePicker',
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

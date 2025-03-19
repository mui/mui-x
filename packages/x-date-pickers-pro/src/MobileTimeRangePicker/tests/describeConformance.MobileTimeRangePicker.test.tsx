import * as React from 'react';
import { describeConformance } from '@mui/internal-test-utils';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { MobileTimeRangePicker } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';

describe('<MobileTimeRangePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(MobileTimeRangePicker, {
    render,
    fieldType: 'single-input',
    variant: 'mobile',
  });

  describeConformance(<MobileTimeRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileTimeRangePicker',
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

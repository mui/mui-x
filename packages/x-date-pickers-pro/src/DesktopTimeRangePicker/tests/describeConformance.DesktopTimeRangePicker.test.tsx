import * as React from 'react';
import { describeConformance } from '@mui/internal-test-utils';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { DesktopTimeRangePicker } from '@mui/x-date-pickers-pro/DesktopTimeRangePicker';

describe('<DesktopTimeRangePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(DesktopTimeRangePicker, {
    render,
    fieldType: 'single-input',
    variant: 'desktop',
  });

  describeConformance(<DesktopTimeRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopTimeRangePicker',
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

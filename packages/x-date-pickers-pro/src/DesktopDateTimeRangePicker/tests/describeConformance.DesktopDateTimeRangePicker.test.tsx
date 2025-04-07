import * as React from 'react';
import { describeConformance } from '@mui/internal-test-utils';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { DesktopDateTimeRangePicker } from '../DesktopDateTimeRangePicker';

describe('<DesktopDateTimeRangePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(DesktopDateTimeRangePicker, {
    render,
    fieldType: 'multi-input',
    variant: 'desktop',
  });

  describeConformance(<DesktopDateTimeRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopDateTimeRangePicker',
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

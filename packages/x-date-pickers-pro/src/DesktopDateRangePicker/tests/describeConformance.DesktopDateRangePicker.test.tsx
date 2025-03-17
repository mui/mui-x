import * as React from 'react';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DesktopDateRangePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(DesktopDateRangePicker, { render, fieldType: 'multi-input', variant: 'desktop' });

  describeConformance(<DesktopDateRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopDateRangePicker',
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

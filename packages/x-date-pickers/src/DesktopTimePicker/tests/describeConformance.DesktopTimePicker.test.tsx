import * as React from 'react';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DesktopTimePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(DesktopTimePicker, {
    render,
    fieldType: 'single-input',
    variant: 'desktop',
  });

  describeConformance(<DesktopTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopTimePicker',
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

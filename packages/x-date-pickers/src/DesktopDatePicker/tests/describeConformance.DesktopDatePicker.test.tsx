import * as React from 'react';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DesktopDatePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(DesktopDatePicker, { render, fieldType: 'single-input', variant: 'desktop' });

  describeConformance(<DesktopDatePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopDatePicker',
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

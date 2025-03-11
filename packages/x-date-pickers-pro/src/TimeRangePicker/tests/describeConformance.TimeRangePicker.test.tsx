import * as React from 'react';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';

describe('<TimeRangePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<TimeRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiTimeRangePicker',
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

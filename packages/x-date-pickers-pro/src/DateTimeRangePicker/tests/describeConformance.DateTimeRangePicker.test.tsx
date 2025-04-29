import * as React from 'react';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { DateTimeRangePicker } from '../DateTimeRangePicker';

describe('<DateTimeRangePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DateTimeRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDateTimeRangePicker',
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

import * as React from 'react';
import { createPickerRenderer, wrapPickerMount } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { DateTimeRangePicker } from '../DateTimeRangePicker';

describe('<DateTimeRangePicker /> - Describes', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<DateTimeRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDateTimeRangePicker',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
      'rootClass',
      'reactTestRenderer',
    ],
  }));
});

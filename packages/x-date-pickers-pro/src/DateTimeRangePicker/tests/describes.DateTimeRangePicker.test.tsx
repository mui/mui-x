import * as React from 'react';
import { createPickerRenderer } from '@unit/date-pickers/helpers';
import { describeConformance } from 'test/utils/describeConformance';
import { DateTimeRangePicker } from '../DateTimeRangePicker';

describe('<DateTimeRangePicker /> - Describes', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

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

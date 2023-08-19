import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { createPickerRenderer, wrapPickerMount } from 'test/utils/pickers';

describe('<DateRangePicker /> - Describes', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<DateRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDateRangePicker',
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

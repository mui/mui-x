import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { wrapPickerMount } from 'test/utils/pickers-utils';

describe('<DateRangePicker /> - Describes', () => {
  describeConformance(<DateRangePicker />, () => ({
    classes: {},
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

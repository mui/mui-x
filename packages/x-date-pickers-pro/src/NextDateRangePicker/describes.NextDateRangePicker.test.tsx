import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';
import {
  wrapPickerMount,
} from 'test/utils/pickers-utils';

describe('<DesktopNextDateRangePicker /> - Describes', () => {
  describeConformance(<NextDateRangePicker />, () => ({
    classes: {},
    muiName: 'MuiNextDateRangePicker',
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

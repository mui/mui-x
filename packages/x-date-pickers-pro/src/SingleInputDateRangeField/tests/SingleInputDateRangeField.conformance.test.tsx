import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { createPickerRenderer, wrapPickerMount } from 'test/utils/pickers-utils';

describe('<SingleInputDateRangeField />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<SingleInputDateRangeField />, () => ({
    classes: {},
    inheritComponent: 'div',
    render,
    muiName: 'MuiSingleInputDateRangeField',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: [
      'reactTestRenderer',
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
    ],
  }));
});

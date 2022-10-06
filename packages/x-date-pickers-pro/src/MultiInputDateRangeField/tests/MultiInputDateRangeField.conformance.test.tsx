import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { createPickerRenderer, wrapPickerMount } from 'test/utils/pickers-utils';

describe('<MultiInputDateRangeField />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<MultiInputDateRangeField />, () => ({
    classes: {},
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputDateRangeField',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: ['reactTestRenderer', 'themeVariants'],
  }));
});

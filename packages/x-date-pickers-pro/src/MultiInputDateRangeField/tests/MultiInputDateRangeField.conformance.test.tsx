import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { createPickerRenderer, wrapPickerMount } from 'test/utils/pickers';

describe('<MultiInputDateRangeField />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<MultiInputDateRangeField />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputDateRangeField',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: ['reactTestRenderer', 'themeVariants'],
  }));
});

import * as React from 'react';
import { describeConformance } from '@mui-internal/test-utils';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { createPickerRenderer, wrapPickerMount } from 'test/utils/pickers';

describe('<MultiInputDateTimeRangeField />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<MultiInputDateTimeRangeField />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputDateTimeRangeField',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: ['componentProp', 'componentsProp', 'reactTestRenderer', 'themeVariants'],
  }));
});

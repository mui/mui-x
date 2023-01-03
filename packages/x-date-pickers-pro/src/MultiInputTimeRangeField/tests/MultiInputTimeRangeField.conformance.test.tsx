import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { Unstable_MultiInputTimeRangeField as MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { createPickerRenderer, wrapPickerMount } from 'test/utils/pickers-utils';

describe('<MultiInputTimeRangeField />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<MultiInputTimeRangeField />, () => ({
    classes: {},
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputTimeRangeField',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: ['reactTestRenderer', 'themeVariants'],
  }));
});

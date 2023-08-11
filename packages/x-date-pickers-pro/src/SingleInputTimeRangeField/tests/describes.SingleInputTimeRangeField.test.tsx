import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { createPickerRenderer, wrapPickerMount } from 'test/utils/pickers';

describe('<SingleInputTimeRangeField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<SingleInputTimeRangeField />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiSingleInputTimeRangeField',
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

  describeRangeValidation(SingleInputTimeRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['hours', 'minutes', 'seconds'],
    isSingleInput: true,
  }));
});

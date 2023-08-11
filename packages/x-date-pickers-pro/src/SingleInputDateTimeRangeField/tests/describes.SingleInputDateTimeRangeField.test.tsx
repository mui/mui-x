import * as React from 'react';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { describeConformance } from '@mui/monorepo/test/utils';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import { createPickerRenderer, wrapPickerMount } from 'test/utils/pickers';

describe('<SingleInputDateTimeRangeField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<SingleInputDateTimeRangeField />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiSingleInputDateTimeRangeField',
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

  describeRangeValidation(SingleInputDateTimeRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'],
    isSingleInput: true,
  }));
});

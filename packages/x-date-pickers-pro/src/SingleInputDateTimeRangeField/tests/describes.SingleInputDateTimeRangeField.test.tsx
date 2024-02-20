import * as React from 'react';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import { createPickerRenderer, wrapPickerMount, describeRangeValidation } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

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

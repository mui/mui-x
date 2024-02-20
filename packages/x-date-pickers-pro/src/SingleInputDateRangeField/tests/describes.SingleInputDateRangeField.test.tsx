import * as React from 'react';
import TextField from '@mui/material/TextField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { createPickerRenderer, wrapPickerMount, describeRangeValidation } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<SingleInputDateRangeField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<SingleInputDateRangeField />, () => ({
    classes: {} as any,
    inheritComponent: TextField,
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

  describeRangeValidation(SingleInputDateRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['year', 'month', 'day'],
    isSingleInput: true,
  }));
});

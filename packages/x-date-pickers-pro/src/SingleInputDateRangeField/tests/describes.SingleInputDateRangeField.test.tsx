import * as React from 'react';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<SingleInputDateRangeField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<SingleInputDateRangeField enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    inheritComponent: PickersTextField,
    render,
    muiName: 'MuiSingleInputDateRangeField',
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

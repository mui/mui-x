import * as React from 'react';
import { createPickerRenderer, describeValidation, describePicker } from 'test/utils/pickers';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<StaticDateTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describePicker(StaticDateTimePicker, { render, fieldType: 'single-input', variant: 'static' });

  describeValidation(StaticDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'static-picker',
  }));

  describeConformance(<StaticDateTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiStaticDateTimePicker',
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
    ],
  }));
});

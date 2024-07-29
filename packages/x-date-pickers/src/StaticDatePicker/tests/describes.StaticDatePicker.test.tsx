import * as React from 'react';
import { createPickerRenderer, describeValidation, describePicker } from 'test/utils/pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<StaticDatePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describePicker(StaticDatePicker, { render, fieldType: 'single-input', variant: 'static' });

  describeValidation(StaticDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'static-picker',
  }));

  describeConformance(<StaticDatePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiStaticDatePicker',
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

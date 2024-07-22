import * as React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { createPickerRenderer } from '@pickers-unit/helpers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DateTimePicker /> - Describes', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describeConformance(<DateTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDateTimePicker',
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

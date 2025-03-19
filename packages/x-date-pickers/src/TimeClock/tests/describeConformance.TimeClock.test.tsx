import * as React from 'react';
import { TimeClock, timeClockClasses as classes } from '@mui/x-date-pickers/TimeClock';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<TimeClock /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<TimeClock />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    refInstanceof: window.HTMLDivElement,
    muiName: 'MuiTimeClock',
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));
});

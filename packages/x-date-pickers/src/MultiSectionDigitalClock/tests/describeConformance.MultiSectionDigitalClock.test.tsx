import * as React from 'react';
import { createPickerRenderer } from 'test/utils/pickers';
import {
  MultiSectionDigitalClock,
  multiSectionDigitalClockClasses as classes,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MultiSectionDigitalClock /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<MultiSectionDigitalClock />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiSectionDigitalClock',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));
});

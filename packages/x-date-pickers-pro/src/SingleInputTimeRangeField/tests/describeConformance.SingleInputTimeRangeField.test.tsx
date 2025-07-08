import * as React from 'react';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<SingleInputTimeRangeField /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<SingleInputTimeRangeField />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiSingleInputTimeRangeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
  }));
});

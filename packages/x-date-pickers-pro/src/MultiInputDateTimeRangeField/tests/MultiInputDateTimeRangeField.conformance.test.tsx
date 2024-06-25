import * as React from 'react';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MultiInputDateTimeRangeField />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<MultiInputDateTimeRangeField enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputDateTimeRangeField',
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: ['componentProp', 'componentsProp', 'reactTestRenderer', 'themeVariants'],
  }));
});

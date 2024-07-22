import * as React from 'react';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { createPickerRenderer } from '@date-pickers-unit/helpers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MultiInputDateTimeRangeField />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<MultiInputDateTimeRangeField enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputDateTimeRangeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));
});

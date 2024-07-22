import * as React from 'react';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { createPickerRenderer } from '@unit/date-pickers/helpers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MultiInputDateRangeField />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<MultiInputDateRangeField enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputDateRangeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['themeVariants', 'componentProp', 'componentsProp'],
  }));
});

import * as React from 'react';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { createPickerRenderer } from '@unit/date-pickers/helpers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MultiInputTimeRangeField />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<MultiInputTimeRangeField enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputTimeRangeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['themeVariants', 'componentProp', 'componentsProp'],
  }));
});

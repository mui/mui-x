import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { describe } from 'vitest';

describe('<MultiInputTimeRangeField /> - Describe Conformance', () => {
  const { render } = createPickerRenderer({
    clockConfig: new Date(2018, 0, 10),
  });

  describeConformance(<MultiInputTimeRangeField />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiInputTimeRangeField',
    refInstanceof: window.HTMLDivElement,
    skip: ['themeVariants', 'componentProp'],
  }));
});

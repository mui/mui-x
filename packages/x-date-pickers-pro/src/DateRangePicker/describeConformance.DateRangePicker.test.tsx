import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { describe } from 'vitest';

describe('<DateRangePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DateRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDateRangePicker',
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
    ],
  }));
});

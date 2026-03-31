import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DateTimePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DateTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDateTimePicker',
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
    ],
  }));
});

import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<StaticDatePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(StaticDatePicker, { render, fieldType: 'single-input', variant: 'static' });

  describeConformance(<StaticDatePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiStaticDatePicker',
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      // Static pickers render through `PickersLayout`, which does not forward
      // unknown props to its root `div`. Enabling `propsSpread` here requires
      // a separate change to either `PickersLayout` or `useStaticPicker`.
      'propsSpread',
    ],
  }));
});

import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { describeConformance } from 'test/utils/describeConformance';
import { describe } from 'vitest';

describe('<MobileTimePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(MobileTimePicker, { render, fieldType: 'single-input', variant: 'mobile' });

  describeConformance(<MobileTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileTimePicker',
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

import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { describeConformance } from 'test/utils/describeConformance';
import { describe } from 'vitest';

describe('<MobileDateTimePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describePicker(MobileDateTimePicker, { render, fieldType: 'single-input', variant: 'mobile' });

  describeConformance(<MobileDateTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileDateTimePicker',
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

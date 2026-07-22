import { PickersTextField, pickersTextFieldClasses } from '@mui/x-date-pickers/PickersTextField';
import { createPickerRenderer, PICKERS_TEXT_FIELD_STUB_PROPS } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<PickersTextField /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<PickersTextField {...PICKERS_TEXT_FIELD_STUB_PROPS} />, () => ({
    classes: pickersTextFieldClasses,
    inheritComponent: 'div',
    render,
    muiName: 'MuiPickersTextField',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'themeVariants'],
  }));
});

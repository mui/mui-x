import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import {
  adapterToUse,
  createPickerRenderer,
  describeRangeValidation,
  setValueOnFieldInput,
} from 'test/utils/pickers';

describe('<MultiInputTimeRangeField /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(MultiInputTimeRangeField, () => ({
    render,
    componentFamily: 'field',
    views: ['hours', 'minutes'],
    fieldType: 'multi-input',
    setValue: (value, { setEndDate } = {}) => {
      setValueOnFieldInput(
        adapterToUse.format(
          value,
          adapterToUse.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h',
        ),
        setEndDate ? 1 : 0,
      );
    },
  }));
});

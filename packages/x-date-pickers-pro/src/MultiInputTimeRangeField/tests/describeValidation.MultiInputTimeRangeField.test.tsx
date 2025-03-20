import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import {
  adapterToUse,
  createPickerRenderer,
  describeRangeValidation,
  setValueOnFieldInput,
} from 'test/utils/pickers';

describe('<MultiInputTimeRangeField /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 10),
  });

  describeRangeValidation(MultiInputTimeRangeField, () => ({
    render,
    clock,
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

import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import {
  createPickerRenderer,
  adapterToUse,
  describeRangeValidation,
  setValueOnFieldInput,
} from 'test/utils/pickers';

describe('<MultiInputDateTimeRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeRangeValidation(MultiInputDateTimeRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    setValue: (value, { setEndDate } = {}) => {
      setValueOnFieldInput(adapterToUse.format(value, 'keyboardDateTime'), setEndDate ? 1 : 0);
    },
  }));
});

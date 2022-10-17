import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import describeValidation from '@mui/x-date-pickers-pro/tests/describeValidation';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<SingleInputDateRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(SingleInputDateRangeField, () => ({
    render,
    clock,
    withDate: true,
    isSingleInput: true,
  }));
});

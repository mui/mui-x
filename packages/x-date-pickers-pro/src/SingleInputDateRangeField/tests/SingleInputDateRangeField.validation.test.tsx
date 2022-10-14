import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import describeValidation from '../../tests/describeValidation';

describe('<SingleInputDateRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(SingleInputDateRangeField, () => ({
    render,
    clock,
    withDate: true,
    isSingleInput: true,
  }));
});

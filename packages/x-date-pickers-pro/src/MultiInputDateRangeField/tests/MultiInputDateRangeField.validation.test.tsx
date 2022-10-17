import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import describeValidation from '@mui/x-date-pickers-pro/tests/describeValidation';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<MultiInputDateRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MultiInputDateRangeField, () => ({
    render,
    clock,
    withDate: true,
  }));
});

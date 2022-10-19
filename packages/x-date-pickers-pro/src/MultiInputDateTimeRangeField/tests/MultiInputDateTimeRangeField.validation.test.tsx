import { Unstable_MultiInputDateTimeRangeField as MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import describeValidation from '@mui/x-date-pickers-pro/tests/describeValidation';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<MultiInputDateTimeRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MultiInputDateTimeRangeField, () => ({
    render,
    clock,
    withDate: true,
    withTime: true,
  }));
});

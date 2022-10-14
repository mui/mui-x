import { Unstable_MultiInputDateTimeRangeField as MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import describeValidation from '../../tests/describeValidation';

describe('<MultiInputDateTimeRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MultiInputDateTimeRangeField, () => ({
    render,
    clock,
    withDate: true,
    withTime: true,
  }));
});

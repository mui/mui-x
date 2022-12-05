import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<MultiInputDateRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeRangeValidation(MultiInputDateRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['year', 'month', 'day'],
  }));
});

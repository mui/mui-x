import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import describeValidation from '../../tests/describeValidation';

describe('<MultiInputDateRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MultiInputDateRangeField, () => ({
    render,
    clock,
    withDate: true,
  }));
});

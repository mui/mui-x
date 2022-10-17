import { Unstable_MultiInputTimeRangeField as MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import describeValidation from '@mui/x-date-pickers-pro/tests/describeValidation';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<MultiInputTimeRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MultiInputTimeRangeField, () => ({
    render,
    clock,
    withTime: true,
  }));
});

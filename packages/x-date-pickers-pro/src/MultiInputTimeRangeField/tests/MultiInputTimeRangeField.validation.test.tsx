import { Unstable_MultiInputTimeRangeField as MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<MultiInputTimeRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeRangeValidation(MultiInputTimeRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['hours', 'minutes'],
  }));
});

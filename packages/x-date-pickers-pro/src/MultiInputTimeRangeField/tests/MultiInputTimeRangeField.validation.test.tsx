import { Unstable_MultiInputTimeRangeField as MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import describeValidation from '../../tests/describeValidation';

describe('<MultiInputTimeRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MultiInputTimeRangeField, () => ({
    render,
    clock,
    withTime: true,
  }));
});

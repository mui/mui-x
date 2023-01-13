import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

describe('<NextDatePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(NextDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'picker',
  }));
});

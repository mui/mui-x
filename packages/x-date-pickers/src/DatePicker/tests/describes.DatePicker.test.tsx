import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

describe('<DatePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'picker',
  }));
});

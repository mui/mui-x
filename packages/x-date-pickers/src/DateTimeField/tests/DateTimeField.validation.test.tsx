import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { Unstable_DateTimeField as DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<DateTimeField /> validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DateTimeField, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'field',
  }));
});

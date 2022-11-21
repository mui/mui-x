import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<DateField /> validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DateField, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'field',
  }));
});

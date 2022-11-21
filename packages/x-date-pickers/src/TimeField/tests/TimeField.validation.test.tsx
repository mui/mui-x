import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { Unstable_TimeField as TimeField } from '@mui/x-date-pickers/TimeField';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<TimeField /> validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(TimeField, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'field',
  }));
});

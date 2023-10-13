import { screen } from '@mui-internal/test-utils';
import { fireEvent } from '@mui-internal/test-utils/createRenderer';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { createPickerRenderer, adapterToUse, describeRangeValidation } from 'test/utils/pickers';

describe('<MultiInputDateTimeRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeRangeValidation(MultiInputDateTimeRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    inputValue: (value, { setEndDate } = {}) => {
      const inputs = screen.getAllByRole('textbox');
      const input = inputs[setEndDate ? 1 : 0];
      input.focus();
      fireEvent.change(input, {
        target: { value: adapterToUse.format(value, 'keyboardDateTime') },
      });
    },
  }));
});

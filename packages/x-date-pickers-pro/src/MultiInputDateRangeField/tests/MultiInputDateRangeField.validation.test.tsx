import { screen } from '@mui/monorepo/test/utils';
import { fireEvent } from '@mui/monorepo/test/utils/createRenderer';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers-utils';

describe('<MultiInputDateRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeRangeValidation(MultiInputDateRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['year', 'month', 'day'],
    inputValue: (value, { setEndDate } = {}) => {
      const inputs = screen.getAllByRole('textbox');
      const input = inputs[setEndDate ? 1 : 0];
      input.focus();
      fireEvent.change(input, { target: { value: adapterToUse.format(value, 'keyboardDate') } });
    },
  }));
});

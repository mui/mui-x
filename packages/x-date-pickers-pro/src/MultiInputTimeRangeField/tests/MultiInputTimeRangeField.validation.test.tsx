import { screen } from '@mui-internal/test-utils';
import { fireEvent } from '@mui-internal/test-utils/createRenderer';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { createPickerRenderer, adapterToUse, describeRangeValidation } from 'test/utils/pickers';

describe('<MultiInputTimeRangeField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeRangeValidation(MultiInputTimeRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['hours', 'minutes'],
    inputValue: (value, { setEndDate } = {}) => {
      const inputs = screen.getAllByRole('textbox');
      const input = inputs[setEndDate ? 1 : 0];
      input.focus();
      fireEvent.change(input, {
        target: { value: adapterToUse.format(value, 'fullTime') },
      });
    },
  }));
});

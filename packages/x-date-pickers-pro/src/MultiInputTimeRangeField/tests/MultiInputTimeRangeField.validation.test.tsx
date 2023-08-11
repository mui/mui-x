import { screen } from '@mui/monorepo/test/utils';
import { fireEvent } from '@mui/monorepo/test/utils/createRenderer';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';

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

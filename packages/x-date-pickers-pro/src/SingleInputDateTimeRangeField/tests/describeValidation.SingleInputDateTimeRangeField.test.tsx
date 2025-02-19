import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';

describe('<SingleInputDateTimeRangeField /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(SingleInputDateTimeRangeField, () => ({
    render,
    componentFamily: 'field',
    views: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'],
    isSingleInput: true,
  }));
});

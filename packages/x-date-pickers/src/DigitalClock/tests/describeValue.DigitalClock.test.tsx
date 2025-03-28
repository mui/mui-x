import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  digitalClockHandler,
  describeValue,
  formatFullTimeValue,
} from 'test/utils/pickers';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<DigitalClock /> - Describe Value', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValue.skip<PickerValue, 'digital-clock'>(DigitalClock, () => ({
    render,
    clock,
    componentFamily: 'digital-clock',
    type: 'time',
    defaultProps: {
      views: ['hours'],
    },
    values: [adapterToUse.date('2018-01-01T15:30:00'), adapterToUse.date('2018-01-01T17:00:00')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const selectedItem = screen.queryByRole('option', { selected: true });
      if (!expectedValue) {
        expect(selectedItem).to.equal(null);
      } else {
        expect(selectedItem).to.have.text(formatFullTimeValue(adapterToUse, expectedValue));
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addMinutes(adapterToUse.addHours(value!, 1), 30);
      digitalClockHandler.setViewValue(adapterToUse, newValue);

      return newValue;
    },
  }));
});

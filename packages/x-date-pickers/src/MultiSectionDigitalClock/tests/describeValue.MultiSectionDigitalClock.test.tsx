import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  multiSectionDigitalClockHandler,
  describeValue,
} from 'test/utils/pickers';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { formatMeridiem, PickerValue } from '@mui/x-date-pickers/internals';

describe('<MultiSectionDigitalClock /> - Describe Value', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValue.skip<PickerValue, 'multi-section-digital-clock'>(MultiSectionDigitalClock, () => ({
    render,
    clock,
    componentFamily: 'multi-section-digital-clock',
    type: 'time',
    values: [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-01T12:35:00')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const selectedItems = screen.queryAllByRole('option', { selected: true });
      if (!expectedValue) {
        expect(selectedItems).to.have.length(0);
      } else {
        const hoursLabel = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'hours12h' : 'hours24h',
        );
        const minutesLabel = adapterToUse.getMinutes(expectedValue).toString();
        expect(selectedItems[0]).to.have.text(hoursLabel);
        expect(selectedItems[1]).to.have.text(minutesLabel);
        if (hasMeridiem) {
          expect(selectedItems[2]).to.have.text(
            formatMeridiem(adapterToUse, adapterToUse.getHours(expectedValue) >= 12 ? 'pm' : 'am'),
          );
        }
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addMinutes(adapterToUse.addHours(value!, 1), 5);
      multiSectionDigitalClockHandler.setViewValue(adapterToUse, newValue);

      return newValue;
    },
  }));
});

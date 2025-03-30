import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { clockPointerClasses, TimeClock } from '@mui/x-date-pickers/TimeClock';
import {
  createPickerRenderer,
  adapterToUse,
  timeClockHandler,
  describeValue,
} from 'test/utils/pickers';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<TimeClock /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'clock'>(TimeClock, () => ({
    render,
    componentFamily: 'clock',
    values: [adapterToUse.date('2018-01-01T12:30:00'), adapterToUse.date('2018-01-01T13:35:00')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const clockPointer = document.querySelector<HTMLDivElement>(`.${clockPointerClasses.root}`);
      if (expectedValue == null) {
        expect(clockPointer).to.equal(null);
      } else {
        const transform = clockPointer?.style?.transform;
        const isMinutesView = screen
          .getByRole('listbox')
          .getAttribute('aria-label')
          ?.includes('minutes');
        if (isMinutesView) {
          expect(transform).to.equal(`rotateZ(${adapterToUse.getMinutes(expectedValue) * 6}deg)`);
        } else {
          const hours = adapterToUse.getHours(expectedValue);
          expect(transform).to.equal(`rotateZ(${(hours > 12 ? hours % 12 : hours) * 30}deg)`);
        }
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addMinutes(adapterToUse.addHours(value!, 1), 5);

      timeClockHandler.setViewValue(adapterToUse, newValue, 'hours');
      timeClockHandler.setViewValue(adapterToUse, newValue, 'minutes');

      return newValue;
    },
  }));
});

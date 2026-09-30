import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValue,
  describeValue,
  formatFullTimeValue,
  getFieldInputRoot,
  multiSectionDigitalClockHandler,
} from 'test/utils/pickers';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { describe } from 'vitest';

describe('<DesktopTimePicker /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'picker'>(DesktopTimePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'time',
    variant: 'desktop',
    values: [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-01T12:35:00')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const fieldRoot = getFieldInputRoot();

      let expectedValueStr: string;
      if (expectedValue) {
        expectedValueStr = formatFullTimeValue(adapterToUse, expectedValue);
      } else {
        expectedValueStr = hasMeridiem ? 'hh:mm aa' : 'hh:mm';
      }

      expectFieldValue(fieldRoot, expectedValueStr);
    },
    setNewValue: async (value, { isOpened, applySameValue, selectSection, pressKey, user }) => {
      const newValue = applySameValue
        ? value!
        : adapterToUse.addMinutes(adapterToUse.addHours(value!, 1), 5);

      if (isOpened) {
        await multiSectionDigitalClockHandler.setViewValue(user, adapterToUse, newValue);
      } else {
        await selectSection('hours');
        await pressKey('ArrowUp');

        await selectSection('minutes');
        await pressKey('PageUp'); // increment by 5 minutes

        const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
        if (hasMeridiem) {
          await selectSection('meridiem');
          const previousHours = adapterToUse.getHours(value!);
          const newHours = adapterToUse.getHours(newValue);
          // update meridiem section if it changed
          if ((previousHours < 12 && newHours >= 12) || (previousHours >= 12 && newHours < 12)) {
            await pressKey('ArrowUp');
          }
        }
      }

      return newValue;
    },
  }));
});

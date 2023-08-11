import * as React from 'react';
import {
  describeConformance,
  screen,
  userEvent,
  fireTouchChangedEvent,
} from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  wrapPickerMount,
  adapterToUse,
  expectInputValue,
  expectInputPlaceholder,
  openPicker,
  getClockTouchEvent,
  getTextbox,
} from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { describePicker } from '@mui/x-date-pickers/tests/describePicker';

describe('<MobileTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 2, 12, 8, 16, 0),
  });

  describePicker(MobileTimePicker, { render, fieldType: 'single-input', variant: 'mobile' });

  describeValidation(MobileTimePicker, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'mobile',
  }));

  describeConformance(<MobileTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileTimePicker',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
      'rootClass',
      'reactTestRenderer',
    ],
  }));

  describeValue(MobileTimePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'time',
    variant: 'mobile',
    values: [
      adapterToUse.date(new Date(2018, 0, 1, 11, 30)),
      adapterToUse.date(new Date(2018, 0, 1, 12, 35)),
    ],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const input = getTextbox();
      if (!expectedValue) {
        expectInputPlaceholder(input, hasMeridiem ? 'hh:mm aa' : 'hh:mm');
      }
      const expectedValueStr = expectedValue
        ? adapterToUse.format(expectedValue, hasMeridiem ? 'fullTime12h' : 'fullTime24h')
        : '';

      expectInputValue(input, expectedValueStr);
    },
    setNewValue: (value, { isOpened, applySameValue }) => {
      if (!isOpened) {
        openPicker({ type: 'time', variant: 'mobile' });
      }

      const newValue = applySameValue
        ? value
        : adapterToUse.addMinutes(adapterToUse.addHours(value, 1), 5);
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      // change hours
      const hourClockEvent = getClockTouchEvent(
        adapterToUse.getHours(newValue),
        hasMeridiem ? '12hours' : '24hours',
      );
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);
      // change minutes
      const minutesClockEvent = getClockTouchEvent(adapterToUse.getMinutes(newValue), 'minutes');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', minutesClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', minutesClockEvent);

      if (hasMeridiem) {
        const newHours = adapterToUse.getHours(newValue);
        // select appropriate meridiem
        userEvent.mousePress(screen.getByRole('button', { name: newHours >= 12 ? 'PM' : 'AM' }));
      }

      // Close the picker
      if (!isOpened) {
        userEvent.keyPress(document.activeElement!, { key: 'Escape' });
        clock.runToLast();
      } else {
        // return to the hours view in case we'd like to repeat the selection process
        userEvent.mousePress(screen.getByRole('button', { name: 'open previous view' }));
      }

      return newValue;
    },
  }));
});

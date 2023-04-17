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
  adapterToUse,
  expectInputValue,
  openPicker,
  wrapPickerMount,
  getClockTouchEvent,
  expectInputPlaceholder,
  getTextbox,
} from 'test/utils/pickers-utils';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

describe('<MobileTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 2, 12, 8, 16, 0),
  });

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
      adapterToUse.date(new Date(2018, 0, 1, 15, 30)),
      adapterToUse.date(new Date(2018, 0, 1, 18, 30)),
    ],
    emptyValue: null,
    defaultProps: {
      openTo: 'minutes',
    },
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
    setNewValue: (value, { isOpened, applySameValue } = {}) => {
      if (!isOpened) {
        openPicker({ type: 'time', variant: 'mobile' });
      }

      const newValue = applySameValue ? value : adapterToUse.addMinutes(value, 1);
      const hourClockEvent = getClockTouchEvent(adapterToUse.getMinutes(newValue), 'minutes');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      // Close the picker to return to the initial state
      if (!isOpened) {
        userEvent.keyPress(document.activeElement!, { key: 'Escape' });
        clock.runToLast();
      }

      return newValue;
    },
  }));
});

import * as React from 'react';
import { describeConformance, screen, fireTouchChangedEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  openPicker,
  wrapPickerMount,
  getClockTouchEvent,
} from 'test/utils/pickers-utils';
import { Unstable_MobileNextTimePicker as MobileNextTimePicker } from '@mui/x-date-pickers/MobileNextTimePicker';
import { CLOCK_WIDTH } from '../../TimeClock/shared';

describe('<MobileNextTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MobileNextTimePicker, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'new-picker',
  }));

  describeConformance(<MobileNextTimePicker />, () => ({
    classes: {},
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

  describeValue(MobileNextTimePicker, () => ({
    render,
    componentFamily: 'new-picker',
    type: 'time',
    variant: 'mobile',
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
    emptyValue: null,
    defaultProps: {
      openTo: 'minutes',
    },
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      let expectedValueStr: string;
      if (expectedValue == null) {
        expectedValueStr = hasMeridiem ? 'hh:mm aa' : 'hh:mm';
      } else {
        expectedValueStr = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'fullTime12h' : 'fullTime24h',
        );
      }
      expectInputValue(screen.getByRole('textbox'), expectedValueStr, true);
    },
    setNewValue: (value, { isOpened, applySameValue } = {}) => {
      if (!isOpened) {
        openPicker({ type: 'time', variant: 'mobile' });
      }

      const newValue = applySameValue ? value : adapterToUse.setMinutes(value, 53);

      const hourClockEvent = getClockTouchEvent(
        applySameValue ? { clientX: CLOCK_WIDTH / 2, clientY: 0 } : undefined,
      );
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      return newValue;
    },
  }));
});

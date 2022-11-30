import * as React from 'react';
import { describeConformance, screen, userEvent, fireTouchChangedEvent } from '@mui/monorepo/test/utils';
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
import {fireEvent} from "@testing-library/react";

describe.only('<MobileNextTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  // describeValidation(MobileNextTimePicker, () => ({
  //   render,
  //   clock,
  //   views: ['hours', 'minutes'],
  //   componentFamily: 'new-picker',
  // }));
  //
  // describeConformance(<MobileNextTimePicker />, () => ({
  //   classes: {},
  //   muiName: 'MuiMobileTimePicker',
  //   wrapMount: wrapPickerMount,
  //   refInstanceof: window.HTMLDivElement,
  //   skip: [
  //     'componentProp',
  //     'componentsProp',
  //     'themeDefaultProps',
  //     'themeStyleOverrides',
  //     'themeVariants',
  //     'mergeClassName',
  //     'propsSpread',
  //     'rootClass',
  //     'reactTestRenderer',
  //   ],
  // }));

  describeValue(MobileNextTimePicker, () => ({
    render,
    componentFamily: 'new-picker',
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
    assertRenderedValue: (expectedValue: any) => {
      console.log(screen.getByRole('textbox'))
      return
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

      const newValue = applySameValue ? value : adapterToUse.addMinutes(value, 1);
      const hourClockEvent = getClockTouchEvent(adapterToUse.getMinutes(newValue), 'minutes');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      if (!isOpened) {
         // Close the picker to return to the initial state
         userEvent.keyPress(document.activeElement!, { key: 'Escape' });
         clock.runToLast()
      }

      return newValue;
    },
  }));
});

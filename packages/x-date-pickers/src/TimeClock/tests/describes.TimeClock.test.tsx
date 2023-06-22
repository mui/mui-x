import * as React from 'react';
import { expect } from 'chai';
import { describeConformance, fireTouchChangedEvent, screen } from '@mui/monorepo/test/utils';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  clockPointerClasses,
  TimeClock,
  timeClockClasses as classes,
} from '@mui/x-date-pickers/TimeClock';
import {
  adapterToUse,
  wrapPickerMount,
  createPickerRenderer,
  getClockTouchEvent,
} from 'test/utils/pickers-utils';

describe('<TimeClock /> - Describes', () => {
  const { render, clock } = createPickerRenderer();

  describeConformance(<TimeClock />, () => ({
    classes,
    inheritComponent: 'div',
    wrapMount: wrapPickerMount,
    render,
    refInstanceof: window.HTMLDivElement,
    muiName: 'MuiTimeClock',
    skip: ['componentProp', 'componentsProp', 'reactTestRenderer', 'themeVariants'],
  }));

  describeValue(TimeClock, () => ({
    render,
    componentFamily: 'clock',
    values: [
      adapterToUse.date(new Date(2018, 0, 1, 12, 30)),
      adapterToUse.date(new Date(2018, 0, 1, 13, 35)),
    ],
    emptyValue: null,
    clock,
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
      const newValue = adapterToUse.addMinutes(adapterToUse.addHours(value, 1), 5);
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

      return newValue;
    },
  }));
});

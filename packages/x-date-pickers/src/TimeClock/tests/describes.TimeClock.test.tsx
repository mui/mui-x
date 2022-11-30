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
  const { render } = createPickerRenderer();

  describeConformance(
    <TimeClock value={adapterToUse.date()} showViewSwitcher onChange={() => {}} />,
    () => ({
      classes,
      inheritComponent: 'div',
      wrapMount: wrapPickerMount,
      render,
      refInstanceof: window.HTMLDivElement,
      muiName: 'MuiTimeClock',
      skip: [
        'componentProp',
        'componentsProp',
        'propsSpread',
        'reactTestRenderer',
        // TODO: fix TimeClock to spread props to root
        'themeDefaultProps',
        'themeVariants',
      ],
    }),
  );

  describeValue(TimeClock, () => ({
    render,
    componentFamily: 'clock',
    values: [
      adapterToUse.date(new Date(2018, 0, 1, 15, 30)),
      adapterToUse.date(new Date(2018, 0, 1, 18, 30)),
    ],
    emptyValue: null,
    defaultProps: {
      openTo: 'minutes',
    },
    assertRenderedValue: (expectedValue: any) => {
      const clockPointer = document.querySelector<HTMLDivElement>(`.${clockPointerClasses.root}`);
      if (expectedValue == null) {
        expect(clockPointer).to.equal(null);
      } else {
        const transform = clockPointer?.style?.transform;
        expect(transform).to.equal(`rotateZ(${adapterToUse.getMinutes(expectedValue) * 6}deg)`);
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addMinutes(value, 1);
      const hourClockEvent = getClockTouchEvent(adapterToUse.getMinutes(newValue), 'minutes');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      return newValue;
    },
  }));
});

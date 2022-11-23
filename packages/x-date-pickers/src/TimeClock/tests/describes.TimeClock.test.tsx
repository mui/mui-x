import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { TimeClock, timeClockClasses as classes } from '@mui/x-date-pickers/TimeClock';
import { adapterToUse, wrapPickerMount, createPickerRenderer } from 'test/utils/pickers-utils';

describe.only('<TimeClock /> - Describes', () => {
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

  // TODO: Enable after #6962 is merged
  // describeValue(TimeClock, () => ({
  //     render,
  //     componentFamily: 'clock',
  //     values: [adapterToUse.date(new Date(2018, 0, 1, 15, 30)), adapterToUse.date(new Date(2018, 0, 1, 18, 30))],
  //     emptyValue: null,
  //     defaultProps: {
  //         openTo: 'minutes',
  //     },
  //     assertRenderedValue: (expectedValue: any) => {
  //         if (expectedValue == null) {
  //             expect(document.querySelector(`.${clockPointerClasses.root}`)).to.equal(null)
  //         }
  //     },
  //     setNewValue: (value) => {
  //         const newValue = adapterToUse.addMinutes(value, 1);
  //         const hourClockEvent = getClockTouchEvent(adapterToUse.getMinutes(newValue), 'minutes');
  //         fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
  //         fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);
  //
  //         return newValue;
  //     },
  // }));
});

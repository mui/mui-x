import * as React from 'react';
import { screen, fireEvent, fireTouchChangedEvent } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  openPicker,
  getClockTouchEvent,
  describeValidation,
  describeValue,
  describePicker,
  formatFullTimeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { describeConformance } from 'test/utils/describeConformance';
import { fireUserEvent } from 'test/utils/fireUserEvent';

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

  describeConformance(<MobileTimePicker enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileTimePicker',
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
    ],
  }));

  describeValue(MobileTimePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'time',
    variant: 'mobile',
    values: [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-01T12:35:00')],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const fieldRoot = getFieldInputRoot();

      let expectedValueStr: string;
      if (expectedValue) {
        expectedValueStr = formatFullTimeValue(adapterToUse, expectedValue);
      } else {
        expectedValueStr = hasMeridiem ? 'hh:mm aa' : 'hh:mm';
      }

      expectFieldValueV7(fieldRoot, expectedValueStr);
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
        fireUserEvent.mousePress(
          screen.getByRole('button', { name: newHours >= 12 ? 'PM' : 'AM' }),
        );
      }

      // Close the picker
      if (!isOpened) {
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
        clock.runToLast();
      } else {
        // return to the hours view in case we'd like to repeat the selection process
        fireUserEvent.mousePress(screen.getByRole('button', { name: 'Open previous view' }));
      }

      return newValue;
    },
  }));
});

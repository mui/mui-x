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
  getFieldInputRoot,
} from 'test/utils/pickers';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { describeConformance } from 'test/utils/describeConformance';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<MobileDateTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 2, 12, 8, 16, 0),
  });

  describePicker(MobileDateTimePicker, { render, fieldType: 'single-input', variant: 'mobile' });

  describeValidation(MobileDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'day', 'hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'mobile',
  }));

  describeConformance(<MobileDateTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileDateTimePicker',
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

  describeValue(MobileDateTimePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-time',
    variant: 'mobile',
    clock,
    values: [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-02T12:35:00')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const fieldRoot = getFieldInputRoot();

      let expectedValueStr: string;
      if (expectedValue) {
        expectedValueStr = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h',
        );
      } else {
        expectedValueStr = hasMeridiem ? 'MM/DD/YYYY hh:mm aa' : 'MM/DD/YYYY hh:mm';
      }

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (value, { isOpened, applySameValue }) => {
      if (!isOpened) {
        openPicker({ type: 'date-time', variant: 'mobile' });
      }

      const newValue = applySameValue
        ? value
        : adapterToUse.addMinutes(adapterToUse.addHours(adapterToUse.addDays(value, 1), 1), 5);
      fireUserEvent.mousePress(
        screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
      );
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
        // return to the date view in case we'd like to repeat the selection process
        fireUserEvent.mousePress(screen.getByRole('tab', { name: 'pick date' }));
      }

      return newValue;
    },
  }));
});

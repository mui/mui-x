import * as React from 'react';
import { describeConformance, fireEvent, screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  describeValue,
  describePicker,
  describeRangeValidation,
  getFieldSectionsContainer,
  openPicker,
} from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import { MobileDateTimeRangePicker } from '../MobileDateTimeRangePicker';

describe('<MobileDateTimeRangePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
  });

  describePicker(MobileDateTimeRangePicker, {
    render,
    fieldType: 'multi-input',
    variant: 'mobile',
  });

  describeRangeValidation(MobileDateTimeRangePicker, () => ({
    render,
    clock,
    views: ['day', 'hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'mobile',
  }));

  describeConformance(<MobileDateTimeRangePicker enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileDateTimeRangePicker',
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

  describeValue(MobileDateTimeRangePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-time-range',
    variant: 'mobile',
    initialFocus: 'start',
    clock,
    values: [
      // initial start and end dates
      [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-04T11:45:00')],
      // start and end dates after `setNewValue`
      [adapterToUse.date('2018-01-02T12:35:00'), adapterToUse.date('2018-01-05T12:50:00')],
    ],
    emptyValue: [null, null],
    assertRenderedValue: (expectedValues: any[]) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const expectedPlaceholder = hasMeridiem ? 'MM/DD/YYYY hh:mm aa' : 'MM/DD/YYYY hh:mm';

      const startSectionsContainer = getFieldSectionsContainer(0);
      const expectedStartValueStr = expectedValues[0]
        ? adapterToUse.format(
            expectedValues[0],
            hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h',
          )
        : expectedPlaceholder;
      expectFieldValueV7(startSectionsContainer, expectedStartValueStr);

      const endSectionsContainer = getFieldSectionsContainer(1);
      const expectedEndValueStr = expectedValues[1]
        ? adapterToUse.format(
            expectedValues[1],
            hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h',
          )
        : expectedPlaceholder;
      expectFieldValueV7(endSectionsContainer, expectedEndValueStr);
    },
    setNewValue: (value, { isOpened, applySameValue, setEndDate = false }) => {
      if (!isOpened) {
        openPicker({
          type: 'date-time-range',
          variant: 'mobile',
          initialFocus: setEndDate ? 'end' : 'start',
        });
      }
      let newValue: any[];
      if (applySameValue) {
        newValue = value;
      } else if (setEndDate) {
        newValue = [
          value[0],
          adapterToUse.addMinutes(adapterToUse.addHours(adapterToUse.addDays(value[1], 1), 1), 5),
        ];
      } else {
        newValue = [
          adapterToUse.addMinutes(adapterToUse.addHours(adapterToUse.addDays(value[0], 1), 1), 5),
          value[1],
        ];
      }

      // if we want to set the end date, we firstly need to switch to end date "range position"
      if (setEndDate) {
        fireUserEvent.mousePress(
          screen.getByRole('button', { name: adapterToUse.format(value[1], 'shortDate') }),
        );
      }

      fireUserEvent.mousePress(
        screen.getByRole('gridcell', {
          name: adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
        }),
      );
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const hours = adapterToUse.format(
        newValue[setEndDate ? 1 : 0],
        hasMeridiem ? 'hours12h' : 'hours24h',
      );
      const hoursNumber = adapterToUse.getHours(newValue[setEndDate ? 1 : 0]);
      fireUserEvent.mousePress(
        screen.getByRole('option', { name: `${parseInt(hours, 10)} hours` }),
      );
      fireUserEvent.mousePress(
        screen.getByRole('option', {
          name: `${adapterToUse.getMinutes(newValue[setEndDate ? 1 : 0])} minutes`,
        }),
      );
      if (hasMeridiem) {
        // meridiem is an extra view on `MobileDateTimeRangePicker`
        // we need to click it to finish selection
        fireUserEvent.mousePress(
          screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }),
        );
      }
      // Close the picker
      if (!isOpened) {
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
        clock.runToLast();
      } else {
        // return to the start date view in case we'd like to repeat the selection process
        fireUserEvent.mousePress(
          screen.getByRole('button', { name: adapterToUse.format(newValue[0], 'shortDate') }),
        );
      }

      return newValue;
    },
  }));
});

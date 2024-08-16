import { screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  describeValidation,
  describeValue,
  describePicker,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { expect } from 'chai';
import * as React from 'react';
import { describeConformance } from 'test/utils/describeConformance';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<DesktopDateTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  it('should respect the `localeText` prop', function test() {
    render(
      <DesktopDateTimePicker
        open
        localeText={{ cancelButtonLabel: 'Custom cancel' }}
        slotProps={{ actionBar: { actions: ['cancel'] } }}
      />,
    );

    expect(screen.queryByText('Custom cancel')).not.to.equal(null);
  });

  describePicker(DesktopDateTimePicker, { render, fieldType: 'single-input', variant: 'desktop' });

  describeValidation(DesktopDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'desktop',
  }));

  describeConformance(<DesktopDateTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopDateTimePicker',
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

  describeValue(DesktopDateTimePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-time',
    variant: 'desktop',
    values: [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-02T12:35:00')],
    emptyValue: null,
    clock,
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
    setNewValue: (value, { isOpened, applySameValue, selectSection, pressKey }) => {
      const newValue = applySameValue
        ? value
        : adapterToUse.addMinutes(adapterToUse.addHours(adapterToUse.addDays(value, 1), 1), 5);

      if (isOpened) {
        fireUserEvent.mousePress(
          screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
        );
        const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
        const hours = adapterToUse.format(newValue, hasMeridiem ? 'hours12h' : 'hours24h');
        const hoursNumber = adapterToUse.getHours(newValue);
        fireUserEvent.mousePress(
          screen.getByRole('option', { name: `${parseInt(hours, 10)} hours` }),
        );
        fireUserEvent.mousePress(
          screen.getByRole('option', { name: `${adapterToUse.getMinutes(newValue)} minutes` }),
        );
        if (hasMeridiem) {
          // meridiem is an extra view on `DesktopDateTimePicker`
          // we need to click it to finish selection
          fireUserEvent.mousePress(
            screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }),
          );
        }
      } else {
        selectSection('day');
        pressKey(undefined, 'ArrowUp');

        selectSection('hours');
        pressKey(undefined, 'ArrowUp');

        selectSection('minutes');
        pressKey(undefined, 'PageUp'); // increment by 5 minutes

        const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
        if (hasMeridiem) {
          selectSection('meridiem');
          const previousHours = adapterToUse.getHours(value);
          const newHours = adapterToUse.getHours(newValue);
          // update meridiem section if it changed
          if ((previousHours < 12 && newHours >= 12) || (previousHours >= 12 && newHours < 12)) {
            pressKey(undefined, 'ArrowUp');
          }
        }
      }

      return newValue;
    },
  }));
});

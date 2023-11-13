import * as React from 'react';
import { screen, userEvent, describeConformance } from '@mui-internal/test-utils';
import {
  createPickerRenderer,
  wrapPickerMount,
  adapterToUse,
  expectInputValue,
  expectInputPlaceholder,
  getTextbox,
  describeValidation,
  describeValue,
  describePicker,
  formatFullTimeValue,
} from 'test/utils/pickers';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

describe('<DesktopTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describePicker(DesktopTimePicker, {
    render,
    fieldType: 'single-input',
    variant: 'desktop',
  });

  describeValidation(DesktopTimePicker, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'desktop',
  }));

  describeConformance(<DesktopTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopTimePicker',
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

  describeValue(DesktopTimePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'time',
    variant: 'desktop',
    values: [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-01T12:35:00')],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const input = getTextbox();
      if (!expectedValue) {
        expectInputPlaceholder(input, hasMeridiem ? 'hh:mm aa' : 'hh:mm');
      }
      expectInputValue(
        input,
        expectedValue ? formatFullTimeValue(adapterToUse, expectedValue) : '',
      );
    },
    setNewValue: (value, { isOpened, applySameValue, selectSection }) => {
      const newValue = applySameValue
        ? value
        : adapterToUse.addMinutes(adapterToUse.addHours(value, 1), 5);

      if (isOpened) {
        const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
        const hours = adapterToUse.format(newValue, hasMeridiem ? 'hours12h' : 'hours24h');
        const hoursNumber = adapterToUse.getHours(newValue);
        userEvent.mousePress(screen.getByRole('option', { name: `${parseInt(hours, 10)} hours` }));
        userEvent.mousePress(
          screen.getByRole('option', { name: `${adapterToUse.getMinutes(newValue)} minutes` }),
        );
        if (hasMeridiem) {
          // meridiem is an extra view on `DesktopTimePicker`
          // we need to click it to finish selection
          userEvent.mousePress(
            screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }),
          );
        }
      } else {
        selectSection('hours');
        const input = getTextbox();
        userEvent.keyPress(input, { key: 'ArrowUp' });
        // move to the minutes section
        userEvent.keyPress(input, { key: 'ArrowRight' });
        // increment by 5 minutes
        userEvent.keyPress(input, { key: 'PageUp' });
        const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
        if (hasMeridiem) {
          // move to the meridiem section
          userEvent.keyPress(input, { key: 'ArrowRight' });
          const previousHours = adapterToUse.getHours(value);
          const newHours = adapterToUse.getHours(newValue);
          // update meridiem section if it changed
          if ((previousHours < 12 && newHours >= 12) || (previousHours >= 12 && newHours < 12)) {
            userEvent.keyPress(input, { key: 'ArrowUp' });
          }
        }
      }

      return newValue;
    },
  }));
});

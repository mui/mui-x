import * as React from 'react';
import { screen, userEvent, describeConformance } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  wrapPickerMount,
  adapterToUse,
  expectInputValue,
  expectInputPlaceholder,
  getTextbox,
} from 'test/utils/pickers';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { describePicker } from '@mui/x-date-pickers/tests/describePicker';

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
    values: [
      adapterToUse.date(new Date(2018, 0, 1, 11, 30)),
      adapterToUse.date(new Date(2018, 0, 1, 12, 35)),
    ],
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
        expectedValue
          ? adapterToUse.format(expectedValue, hasMeridiem ? 'fullTime12h' : 'fullTime24h')
          : '',
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

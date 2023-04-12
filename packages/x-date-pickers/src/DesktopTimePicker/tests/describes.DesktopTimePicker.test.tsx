import * as React from 'react';
import { userEvent, describeConformance } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  buildFieldInteractions,
  wrapPickerMount,
  getTextbox,
  expectInputPlaceholder,
} from 'test/utils/pickers-utils';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

describe('<DesktopTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const { clickOnInput } = buildFieldInteractions({ clock, render, Component: DesktopTimePicker });

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
      adapterToUse.date(new Date(2018, 0, 1, 15, 30)),
      adapterToUse.date(new Date(2018, 0, 1, 18, 30)),
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
    setNewValue: (value, { isOpened } = {}) => {
      const newValue = adapterToUse.addHours(value, 1);

      if (isOpened) {
        throw new Error("Can't test UI views on DesktopTimePicker");
      }

      const input = getTextbox();
      clickOnInput(input, 1); // Update the hour
      userEvent.keyPress(input, { key: 'ArrowUp' });

      return newValue;
    },
  }));
});

import * as React from 'react';
import { screen, userEvent, describeConformance } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  buildFieldInteractions,
  wrapPickerMount,
} from 'test/utils/pickers-utils';
import { Unstable_DesktopNextTimePicker as DesktopNextTimePicker } from '@mui/x-date-pickers/DesktopNextTimePicker';

describe('<DesktopNextTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const { clickOnInput } = buildFieldInteractions({ clock });

  describeValidation(DesktopNextTimePicker, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'new-picker',
  }));

  describeConformance(<DesktopNextTimePicker />, () => ({
    classes: {},
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

  describeValue(DesktopNextTimePicker, () => ({
    render,
    componentFamily: 'new-picker',
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
      let expectedValueStr: string;
      if (expectedValue == null) {
        expectedValueStr = hasMeridiem ? 'hh:mm aa' : 'hh:mm';
      } else {
        expectedValueStr = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'fullTime12h' : 'fullTime24h',
        );
      }
      expectInputValue(screen.getByRole('textbox'), expectedValueStr, true);
    },
    setNewValue: (value, { isOpened } = {}) => {
      const newValue = adapterToUse.addHours(value, 1);

      if (isOpened) {
        throw new Error("Can't test UI views on DesktopNextTimePicker");
      }

      const input = screen.getByRole('textbox');
      clickOnInput(input, 1); // Update the hour
      userEvent.keyPress(input, { key: 'ArrowUp' });

      return newValue;
    },
  }));
});

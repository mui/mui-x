import * as React from 'react';
import { screen, userEvent, describeConformance } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import { createPickerRenderer, adapterToUse, wrapPickerMount } from 'test/utils/pickers-utils';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { expect } from 'chai';

describe('<DigitalClock /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DigitalClock, () => ({
    render,
    clock,
    views: ['hours'],
    componentFamily: 'clock',
    variant: 'desktop',
  }));

  describeConformance(<DigitalClock />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDigitalClock',
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

  describeValue(DigitalClock, () => ({
    render,
    componentFamily: 'clock',
    type: 'time',
    variant: 'desktop',
    defaultProps: {
      views: ['hours'],
    },
    values: [
      adapterToUse.date(new Date(2018, 0, 1, 15, 30)),
      adapterToUse.date(new Date(2018, 0, 1, 16, 15)),
    ],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const selectedItem = document.querySelector('[role="menuitem"].Mui-selected');
      if (!expectedValue) {
        expect(selectedItem).to.equal(null);
      } else {
        expect(selectedItem).to.have.text(
          adapterToUse.format(expectedValue, hasMeridiem ? 'fullTime12h' : 'fullTime24h'),
        );
      }
    },
    setNewValue: (value) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const formattedLabel = adapterToUse.format(
        value,
        hasMeridiem ? 'fullTime12h' : 'fullTime24h',
      );
      userEvent.mousePress(screen.getByRole('menuitem', { name: formattedLabel }));

      return value;
    },
  }));
});

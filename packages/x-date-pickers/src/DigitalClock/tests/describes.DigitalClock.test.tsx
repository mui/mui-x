import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  digitalClockHandler,
  describeValidation,
  describeValue,
  formatFullTimeValue,
} from 'test/utils/pickers';
import { DigitalClock, digitalClockClasses as classes } from '@mui/x-date-pickers/DigitalClock';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DigitalClock /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DigitalClock, () => ({
    render,
    clock,
    views: ['hours'],
    componentFamily: 'digital-clock',
    variant: 'desktop',
  }));

  describeConformance(<DigitalClock />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiDigitalClock',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));

  describeValue(DigitalClock, () => ({
    render,
    componentFamily: 'digital-clock',
    type: 'time',
    variant: 'desktop',
    defaultProps: {
      views: ['hours'],
    },
    values: [adapterToUse.date('2018-01-01T15:30:00'), adapterToUse.date('2018-01-01T17:00:00')],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const selectedItem = screen.queryByRole('option', { selected: true });
      if (!expectedValue) {
        expect(selectedItem).to.equal(null);
      } else {
        expect(selectedItem).to.have.text(formatFullTimeValue(adapterToUse, expectedValue));
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addMinutes(adapterToUse.addHours(value, 1), 30);
      digitalClockHandler.setViewValue(adapterToUse, newValue);

      return newValue;
    },
  }));
});

import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  multiSectionDigitalClockHandler,
  describeValidation,
  describeValue,
} from 'test/utils/pickers';
import {
  MultiSectionDigitalClock,
  multiSectionDigitalClockClasses as classes,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { formatMeridiem } from '@mui/x-date-pickers/internals';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MultiSectionDigitalClock /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MultiSectionDigitalClock, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'multi-section-digital-clock',
    variant: 'desktop',
  }));

  describeConformance(<MultiSectionDigitalClock />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMultiSectionDigitalClock',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));

  describeValue(MultiSectionDigitalClock, () => ({
    render,
    componentFamily: 'multi-section-digital-clock',
    type: 'time',
    variant: 'desktop',
    values: [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-01T12:35:00')],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const selectedItems = screen.queryAllByRole('option', { selected: true });
      if (!expectedValue) {
        expect(selectedItems).to.have.length(0);
      } else {
        const hoursLabel = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'hours12h' : 'hours24h',
        );
        const minutesLabel = adapterToUse.getMinutes(expectedValue).toString();
        expect(selectedItems[0]).to.have.text(hoursLabel);
        expect(selectedItems[1]).to.have.text(minutesLabel);
        if (hasMeridiem) {
          expect(selectedItems[2]).to.have.text(
            formatMeridiem(adapterToUse, adapterToUse.getHours(expectedValue) >= 12 ? 'pm' : 'am'),
          );
        }
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addMinutes(adapterToUse.addHours(value, 1), 5);
      multiSectionDigitalClockHandler.setViewValue(adapterToUse, newValue);

      return newValue;
    },
  }));
});

import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { DateCalendar, dateCalendarClasses as classes } from '@mui/x-date-pickers/DateCalendar';
import { pickersDayClasses } from '@mui/x-date-pickers/PickersDay';
import {
  adapterToUse,
  createPickerRenderer,
  describeValidation,
  describeValue,
} from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<DateCalendar /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DateCalendar, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'calendar',
  }));

  describeConformance(<DateCalendar defaultValue={adapterToUse.date()} />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiDateCalendar',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));

  describeValue(DateCalendar, () => ({
    render,
    componentFamily: 'calendar',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const selectedCells = document.querySelectorAll(`.${pickersDayClasses.selected}`);
      if (expectedValue == null) {
        expect(selectedCells).to.have.length(0);
      } else {
        expect(selectedCells).to.have.length(1);
        expect(selectedCells[0]).to.have.text(adapterToUse.getDate(expectedValue).toString());
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addDays(value, 1);
      fireUserEvent.mousePress(
        screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
      );

      return newValue;
    },
  }));
});

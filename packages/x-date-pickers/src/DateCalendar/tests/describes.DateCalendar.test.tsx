import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { DateCalendar, dateCalendarClasses as classes } from '@mui/x-date-pickers/DateCalendar';
import {
  adapterToUse,
  createPickerRenderer,
  describeValidation,
  describeValue,
} from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import userEvent from '@testing-library/user-event';

describe('<DateCalendar /> - Describes', () => {
  const { render, clock } = createPickerRenderer();

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
      const selectedCell = screen.queryByRole('gridcell', { selected: true });
      if (expectedValue == null) {
        expect(selectedCell).to.equal(null);
      } else {
        expect(selectedCell).not.to.equal(null);
        expect(selectedCell).to.have.text(adapterToUse.getDate(expectedValue).toString());
      }
    },
    setNewValue: async (value) => {
      const newValue = adapterToUse.addDays(value, 1);
      await userEvent.click(
        screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
      );

      return newValue;
    },
  }));
});

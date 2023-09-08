import * as React from 'react';
import { expect } from 'chai';
import { userEvent, screen, describeConformance } from '@mui/monorepo/test/utils';
import {
  pickersYearClasses,
  YearCalendar,
  yearCalendarClasses as classes,
} from '@mui/x-date-pickers/YearCalendar';
import { wrapPickerMount, createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';

describe('<YearCalendar /> - Describes', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
  });

  describeValidation(YearCalendar, () => ({
    render,
    clock,
    views: ['year'],
    componentFamily: 'calendar',
  }));

  describeConformance(<YearCalendar defaultValue={adapterToUse.date()} />, () => ({
    classes,
    inheritComponent: 'div',
    wrapMount: wrapPickerMount,
    render,
    muiName: 'MuiYearCalendar',
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: ['componentProp', 'componentsProp', 'reactTestRenderer', 'themeVariants'],
  }));

  describeValue(YearCalendar, () => ({
    render,
    componentFamily: 'calendar',
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2019, 0, 1))],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const selectedCells = document.querySelectorAll(`.${pickersYearClasses.selected}`);
      if (expectedValue == null) {
        expect(selectedCells).to.have.length(1);
        expect(selectedCells[0]).to.have.text(adapterToUse.getYear(adapterToUse.date()).toString());
      } else {
        expect(selectedCells).to.have.length(1);
        expect(selectedCells[0]).to.have.text(adapterToUse.getYear(expectedValue).toString());
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addYears(value, 1);
      userEvent.mousePress(
        screen.getByRole('button', { name: adapterToUse.getYear(newValue).toString() }),
      );

      return newValue;
    },
  }));
});

import * as React from 'react';
import { expect } from 'chai';
import { describeConformance, userEvent, screen } from '@mui/monorepo/test/utils';
import { wrapPickerMount, createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  MonthCalendar,
  monthCalendarClasses as classes,
  pickersMonthClasses,
} from '@mui/x-date-pickers/MonthCalendar';

describe('<MonthCalendar /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MonthCalendar, () => ({
    render,
    clock,
    views: ['month'],
    componentFamily: 'calendar',
  }));

  describeConformance(<MonthCalendar defaultValue={adapterToUse.date()} />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    wrapMount: wrapPickerMount,
    muiName: 'MuiMonthCalendar',
    refInstanceof: window.HTMLDivElement,
    // cannot test reactTestRenderer because of required context
    skip: ['componentProp', 'componentsProp', 'reactTestRenderer', 'themeVariants'],
  }));

  describeValue(MonthCalendar, () => ({
    render,
    componentFamily: 'calendar',
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 1, 1))],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const selectedCells = document.querySelectorAll(`.${pickersMonthClasses.selected}`);
      if (expectedValue == null) {
        expect(selectedCells).to.have.length(1);
        expect(selectedCells[0]).to.have.text(
          adapterToUse.format(adapterToUse.date(), 'monthShort').toString(),
        );
      } else {
        expect(selectedCells).to.have.length(1);
        expect(selectedCells[0]).to.have.text(
          adapterToUse.format(expectedValue, 'monthShort').toString(),
        );
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addMonths(value, 1);

      userEvent.mousePress(
        screen.getByRole('button', { name: adapterToUse.format(newValue, 'monthShort') }),
      );

      return newValue;
    },
  }));
});

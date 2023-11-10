import * as React from 'react';
import { expect } from 'chai';
import { userEvent, screen, describeConformance } from '@mui-internal/test-utils';
import { YearCalendar, yearCalendarClasses as classes } from '@mui/x-date-pickers/YearCalendar';
import {
  wrapPickerMount,
  createPickerRenderer,
  adapterToUse,
  describeValidation,
  describeValue,
} from 'test/utils/pickers';

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
      const activeYear = screen
        .queryAllByRole('radio')
        .find((cell) => cell.getAttribute('tabindex') === '0');
      expect(activeYear).not.to.equal(null);
      if (expectedValue == null) {
        expect(activeYear).to.have.text(adapterToUse.getYear(adapterToUse.date()).toString());
      } else {
        expect(activeYear).to.have.text(adapterToUse.getYear(expectedValue).toString());
        expect(activeYear).to.have.attribute('aria-checked', 'true');
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addYears(value, 1);
      userEvent.mousePress(
        screen.getByRole('radio', { name: adapterToUse.getYear(newValue).toString() }),
      );

      return newValue;
    },
  }));
});

import * as React from 'react';
import { expect } from 'chai';
import { userEvent, screen } from '@mui/internal-test-utils';
import {
  wrapPickerMount,
  createPickerRenderer,
  adapterToUse,
  describeValidation,
  describeValue,
} from 'test/utils/pickers';
import { MonthCalendar, monthCalendarClasses as classes } from '@mui/x-date-pickers/MonthCalendar';
import { describeConformance } from 'test/utils/describeConformance';

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
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-02-01')],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const activeMonth = screen
        .queryAllByRole('radio')
        .find((cell) => cell.getAttribute('tabindex') === '0');
      expect(activeMonth).not.to.equal(null);
      if (expectedValue == null) {
        expect(activeMonth).to.have.text(
          adapterToUse.format(adapterToUse.date(), 'monthShort').toString(),
        );
      } else {
        expect(activeMonth).to.have.text(
          adapterToUse.format(expectedValue, 'monthShort').toString(),
        );
        expect(activeMonth).to.have.attribute('aria-checked', 'true');
      }
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addMonths(value, 1);

      userEvent.mousePress(
        screen.getByRole('radio', { name: adapterToUse.format(newValue, 'month') }),
      );

      return newValue;
    },
  }));
});

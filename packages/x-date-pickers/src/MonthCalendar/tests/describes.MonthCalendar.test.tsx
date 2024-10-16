import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  describeValidation,
  describeValue,
} from 'test/utils/pickers';
import { MonthCalendar, monthCalendarClasses as classes } from '@mui/x-date-pickers/MonthCalendar';
import { describeConformance } from 'test/utils/describeConformance';
import userEvent from '@testing-library/user-event';

describe('<MonthCalendar /> - Describes', () => {
  const { render, clock } = createPickerRenderer();

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
    muiName: 'MuiMonthCalendar',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
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
    setNewValue: async (value) => {
      const newValue = adapterToUse.addMonths(value, 1);

      await userEvent.click(
        screen.getByRole('radio', { name: adapterToUse.format(newValue, 'month') }),
      );

      return newValue;
    },
  }));
});

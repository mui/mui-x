import * as React from 'react';
import { pickersCalendarHeaderClasses } from '@mui/x-date-pickers/PickersCalendarHeader';
import { pickersArrowSwitcherClasses } from '@mui/x-date-pickers/internals';
import { PickersRangeCalendarHeader } from '@mui/x-date-pickers-pro/PickersRangeCalendarHeader';
import { ConformanceOptions } from '@mui/internal-test-utils';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

const CALENDARS_TO_CLASSES_MAP: Record<1 | 2, ConformanceOptions['classes']> = {
  1: pickersCalendarHeaderClasses,
  2: pickersArrowSwitcherClasses,
};

describe('<PickersRangeCalendarHeader /> - Describes', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  Object.entries(CALENDARS_TO_CLASSES_MAP).forEach(([calendars, classes]) => {
    describeConformance(
      <PickersRangeCalendarHeader
        calendars={parseInt(calendars, 10) as 1 | 2}
        monthIndex={0}
        month={adapterToUse.date('2018-01-01')}
        currentMonth={adapterToUse.date('2018-01-01')}
        minDate={adapterToUse.date('1900-01-01')}
        maxDate={adapterToUse.date('2100-12-31')}
        onMonthChange={() => {}}
        views={['day']}
        view="day"
        timezone="system"
        reduceAnimations
      />,
      () => ({
        classes,
        inheritComponent: 'div',
        render,
        muiName: 'MuiPickersRangeCalendarHeader',
        refInstanceof: window.HTMLDivElement,
        skip: [
          'componentProp',
          'componentsProp',
          'themeVariants',
          'themeDefaultProps',
          'themeStyleOverrides',
        ],
      }),
    );
  });
});

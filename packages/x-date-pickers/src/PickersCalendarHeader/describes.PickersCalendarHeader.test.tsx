import * as React from 'react';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { PickersCalendarHeader } from './PickersCalendarHeader';
import { pickersCalendarHeaderClasses } from './pickersCalendarHeaderClasses';

describe('<PickersCalendarHeader /> - Describes', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describeConformance(
    <PickersCalendarHeader
      currentMonth={adapterToUse.date('2018-01-01')}
      minDate={adapterToUse.date('1900-01-01')}
      maxDate={adapterToUse.date('2100-12-31')}
      onMonthChange={() => {}}
      views={['year', 'day']}
      view="day"
      timezone="system"
      reduceAnimations
    />,
    () => ({
      classes: pickersCalendarHeaderClasses,
      inheritComponent: 'div',
      render,
      muiName: 'MuiPickersCalendarHeader',
      refInstanceof: window.HTMLDivElement,
      skip: ['componentProp', 'componentsProp', 'themeVariants'],
      slots: {
        switchViewButton: {
          expectedClassName: pickersCalendarHeaderClasses.switchViewButton,
        },
        switchViewIcon: {
          expectedClassName: pickersCalendarHeaderClasses.switchViewIcon,
        },
      },
    }),
  );
});

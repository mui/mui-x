import * as React from 'react';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { MonthCalendar, monthCalendarClasses as classes } from '@mui/x-date-pickers/MonthCalendar';
import { describeConformance } from 'test/utils/describeConformance';

describe('<MonthCalendar /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<MonthCalendar defaultValue={adapterToUse.date()} />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiMonthCalendar',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));
});

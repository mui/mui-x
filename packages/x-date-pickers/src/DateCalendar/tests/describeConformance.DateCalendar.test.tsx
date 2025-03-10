import * as React from 'react';
import { DateCalendar, dateCalendarClasses as classes } from '@mui/x-date-pickers/DateCalendar';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DateCalendar /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();
  describeConformance(<DateCalendar defaultValue={adapterToUse.date()} />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiDateCalendar',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));
});

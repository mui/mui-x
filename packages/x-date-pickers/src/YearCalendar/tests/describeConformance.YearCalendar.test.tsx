import * as React from 'react';
import { YearCalendar, yearCalendarClasses as classes } from '@mui/x-date-pickers/YearCalendar';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<YearCalendar /> - Describe Conformance', () => {
  const { render } = createPickerRenderer({});

  describeConformance(<YearCalendar defaultValue={adapterToUse.date()} />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiYearCalendar',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));
});

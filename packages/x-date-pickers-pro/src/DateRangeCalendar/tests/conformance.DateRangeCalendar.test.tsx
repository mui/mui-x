import * as React from 'react';
import { createPickerRenderer, wrapPickerMount } from 'test/utils/pickers-utils';
import { describeConformance } from '@mui/monorepo/test/utils';
import {
  DateRangeCalendar,
  dateRangeCalendarClasses as classes,
} from '@mui/x-date-pickers-pro/DateRangeCalendar';

describe.only('<DateRangeCalendar /> - Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DateRangeCalendar />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiDateRangeCalendar',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'componentsProp', 'reactTestRenderer', 'themeVariants'],
  }));
});

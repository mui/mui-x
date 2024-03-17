import * as React from 'react';
import {
  DayCalendarSkeleton,
  dayCalendarSkeletonClasses as classes,
} from '@mui/x-date-pickers/DayCalendarSkeleton';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DayCalendarSkeleton />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DayCalendarSkeleton />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiDayCalendarSkeleton',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'refForwarding', 'componentsProp', 'themeVariants'],
  }));
});

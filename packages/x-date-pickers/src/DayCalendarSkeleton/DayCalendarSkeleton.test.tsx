import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import {
  DayCalendarSkeleton,
  dayCalendarSkeletonClasses as classes,
} from '@mui/x-date-pickers/DayCalendarSkeleton';
import { createPickerRenderer } from 'test/utils/pickers';

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

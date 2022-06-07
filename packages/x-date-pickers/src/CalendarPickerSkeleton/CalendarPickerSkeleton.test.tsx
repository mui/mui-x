import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import {
  CalendarPickerSkeleton,
  calendarPickerSkeletonClasses as classes,
} from '@mui/x-date-pickers/CalendarPickerSkeleton';
import { createPickerRenderer } from '../../../../test/utils/pickers-utils';

describe('<CalendarPickerSkeleton />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<CalendarPickerSkeleton />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiCalendarPickerSkeleton',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'refForwarding', 'componentsProp', 'themeVariants'],
  }));
});

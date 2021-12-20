import * as React from 'react';
import { createRenderer, describeConformance } from '@material-ui/monorepo/test/utils';
import {
  CalendarPickerSkeleton,
  calendarPickerSkeletonClasses as classes,
} from '@mui/x-date-picker';

describe('<CalendarPickerSkeleton />', () => {
  const { render } = createRenderer();

  describeConformance(<CalendarPickerSkeleton />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiCalendarPickerSkeleton',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'refForwarding', 'componentsProp', 'themeVariants'],
  }));
});

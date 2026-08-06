import * as React from 'react';
import {
  DayCalendarSkeleton,
  dayCalendarSkeletonClasses as classes,
} from '@mui/x-date-pickers/DayCalendarSkeleton';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DayCalendarSkeleton />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DayCalendarSkeleton />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiDayCalendarSkeleton',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'refForwarding', 'themeVariants'],
  }));

  describe.skipIf(isJSDOM)('dimensions', () => {
    const getDaySize = (container: HTMLElement) => {
      const { width, height } = container
        .querySelector(`.${classes.daySkeleton}`)!
        .getBoundingClientRect();
      return { width, height };
    };

    it('uses the default day size', () => {
      const { container } = render(<DayCalendarSkeleton />);

      expect(getDaySize(container)).to.deep.equal({ width: 36, height: 36 });
    });

    it('follows `--PickerCalendar-daySize` so the skeleton matches the calendar it replaces', () => {
      const { container } = render(
        <DayCalendarSkeleton sx={{ '--PickerCalendar-daySize': '24px' }} />,
      );

      expect(getDaySize(container)).to.deep.equal({ width: 24, height: 24 });
    });
  });
});

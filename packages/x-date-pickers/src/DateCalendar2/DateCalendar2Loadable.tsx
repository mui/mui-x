import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import { useDateCalendar2Context, useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { DAYS_GRID_BODY_HEIGHT } from './DateCalendar2.utils';
import { DateView } from '../models/views';
import { DateCalendar2DaysGridBody, DateCalendar2DaysGridRow } from './DateCalendar2DaysGrid';
import { DAY_MARGIN, DAY_SIZE } from '../internals/constants/dimensions';

const DateCalendar2LoadingPanelContainer = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'LoadingPanelContainer',
  overridesResolver: (_, styles) => styles.loadingPanelContainer,
})({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: '1 1 auto',
  '&[data-view="day"]': {
    minHeight: DAYS_GRID_BODY_HEIGHT,
  },
});

const DateCalendar2MonthOrYearLoadingPanel = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'MonthOrYearLoadingPanel',
  overridesResolver: (_, styles) => styles.monthOrYearLoading,
})({});

const DateCalendar2LoadingDaysButton = styled(Skeleton, {
  name: 'MuiDayCalendarSkeleton',
  slot: 'DaySkeleton',
  overridesResolver: (props, styles) => styles.daySkeleton,
})({
  margin: `0 ${DAY_MARGIN}px`,
  '&[data-outside-month="true"]': {
    visibility: 'hidden',
  },
});

const isDayHidden = (weekIndex: number, dayIndex: number, weekAmount: number) => {
  if (weekIndex === 0 && dayIndex === 0) {
    return true;
  }

  if (weekIndex === weekAmount - 1 && dayIndex > 3) {
    return true;
  }

  return false;
};

function DateCalendar2LoadingPanel() {
  const { view } = useDateCalendar2Context();
  if (view === 'day') {
    // TODO: Respect fixedWeekNumber and displayWeekNumber
    return (
      <DateCalendar2DaysGridBody>
        {Array.from({ length: 4 }, (_, weekIndex) => (
          <DateCalendar2DaysGridRow key={weekIndex}>
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <DateCalendar2LoadingDaysButton
                key={dayIndex}
                variant="circular"
                width={DAY_SIZE}
                height={DAY_SIZE}
                data-outside-month={isDayHidden(weekIndex, dayIndex, 4)}
              />
            ))}
          </DateCalendar2DaysGridRow>
        ))}
      </DateCalendar2DaysGridBody>
    );
  }

  return <DateCalendar2MonthOrYearLoadingPanel>...</DateCalendar2MonthOrYearLoadingPanel>;
}

export function DateCalendar2Loadable(props: DateCalendar2LoadableProps) {
  const { children, view } = props;
  const { loading } = useDateCalendar2PrivateContext();

  if (loading) {
    return (
      <DateCalendar2LoadingPanelContainer data-view={view}>
        <WrappedDateCalendar2LoadingPanel />
      </DateCalendar2LoadingPanelContainer>
    );
  }

  return children;
}

function WrappedDateCalendar2LoadingPanel() {
  const { ownerState } = usePickerPrivateContext();
  const { classes, slots, slotProps } = useDateCalendar2PrivateContext();

  const LoadingPanel = slots?.loadingPanel ?? DateCalendar2LoadingPanel;
  const daysButtonProps = useSlotProps({
    elementType: LoadingPanel,
    externalSlotProps: slotProps?.loadingPanel,
    ownerState,
    className: classes.loadingPanel,
  });

  return <LoadingPanel {...daysButtonProps} />;
}

interface DateCalendar2LoadableProps {
  children: React.ReactNode;
  view: DateView;
}

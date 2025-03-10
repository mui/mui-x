import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { DAY_MARGIN, DAY_SIZE } from '../internals/constants/dimensions';
import { useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { DateCalendar2Classes, getDateCalendar2UtilityClass } from './DateCalendar2.classes';

export const DAYS_GRID_BODY_HEIGHT = (DAY_SIZE + DAY_MARGIN * 2) * 6;

export function useLoadingPanel(parameters: UseLoadingPanelParameters) {
  const { forwardedProps, ref, defaultComponent: DefaultComponent } = parameters;
  const { classes, slots, slotProps } = useDateCalendar2PrivateContext();
  const { ownerState } = usePickerPrivateContext();
  const LoadingPanel = slots?.loadingPanel ?? DefaultComponent;
  const loadingPanelProps = useSlotProps({
    elementType: LoadingPanel,
    externalSlotProps: slotProps?.loadingPanel,
    externalForwardedProps: forwardedProps,
    additionalProps: {
      ref,
    },
    ownerState,
    className: classes.loadingPanel,
  });

  const renderLoading = () => <LoadingPanel {...loadingPanelProps} />;

  return renderLoading;
}

interface UseLoadingPanelParameters {
  defaultComponent: React.ElementType<React.HTMLAttributes<HTMLDivElement>>;
  forwardedProps?: React.HTMLAttributes<HTMLDivElement>;
  ref?: React.ForwardedRef<HTMLDivElement>;
}

export function useUtilityClasses(classes: Partial<DateCalendar2Classes> | undefined) {
  return React.useMemo<DateCalendar2Classes>(() => {
    const slots = {
      root: ['root'],
      transitionGroup: ['transitionGroup'],
      headerRoot: ['headerRoot'],
      headerLabelContainer: ['headerLabelContainer'],
      headerLabelTransitionGroup: ['headerLabelTransitionGroup'],
      headerLabelContent: ['headerLabelContent'],
      headerSwitchViewButton: ['headerSwitchViewButton'],
      headerSwitchViewIcon: ['headerSwitchViewIcon'],
      headerNavigation: ['headerNavigation'],
      headerNavigationButton: ['headerNavigationButton'],
      headerNavigationIcon: ['headerNavigationIcon'],
      headerNavigationSpacer: ['headerNavigationSpacer'],
      dayGridRoot: ['daysGridRoot'],
      dayGridHeader: ['daysGridHeader'],
      dayGridWeekNumberHeaderCell: ['daysGridWeekNumberHeaderCell'],
      dayGridHeaderCell: ['daysGridHeaderCell'],
      dayGridBodyTransitionGroup: ['daysGridBodyTransitionGroup'],
      dayGridBody: ['daysGridBody'],
      dayGridRow: ['daysGridRow'],
      dayGridWeekNumberCell: ['daysGridWeekNumberCell'],
      dayCell: ['daysCell'],
      dayCellSkeleton: ['daysCellSkeleton'],
      monthGridRoot: ['monthsGridRoot'],
      monthCell: ['monthsCell'],
      monthCellSkeleton: ['monthsCellSkeleton'],
      yearGridRoot: ['yearsGridRoot'],
      yearCell: ['yearsCell'],
      yearCellSkeleton: ['yearsCellSkeleton'],
      loadingPanel: ['loadingPanel'],
    };

    return composeClasses(slots, getDateCalendar2UtilityClass, classes);
  }, [classes]);
}

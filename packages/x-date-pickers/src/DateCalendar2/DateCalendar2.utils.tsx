import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { DAY_MARGIN, DAY_SIZE } from '../internals/constants/dimensions';
import { useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { DateView } from '../models/views';
import { DateCalendar2LoadingPanelContainer } from './DateCalendar2.parts';

export const DAYS_GRID_BODY_HEIGHT = (DAY_SIZE + DAY_MARGIN * 2) * 6;

export function useLoadingPanel(parameters: UseLoadingPanelParameters) {
  const { view, defaultComponent: DefaultComponent } = parameters;
  const { classes, slots, slotProps } = useDateCalendar2PrivateContext();
  const { ownerState } = usePickerPrivateContext();
  const LoadingPanel = slots?.loadingPanel ?? DefaultComponent;
  const loadingPanelProps = useSlotProps({
    elementType: LoadingPanel,
    externalSlotProps: slotProps?.loadingPanel,
    ownerState,
    className: classes.loadingPanel,
  });

  const renderLoadingPanel = (
    params?: React.HTMLAttributes<HTMLDivElement> & { ref: React.ForwardedRef<HTMLDivElement> },
  ) => (
    // TODO: Add className
    <DateCalendar2LoadingPanelContainer data-view={view} {...params}>
      <LoadingPanel {...loadingPanelProps} />
    </DateCalendar2LoadingPanelContainer>
  );

  return renderLoadingPanel;
}

interface UseLoadingPanelParameters {
  view: DateView;
  defaultComponent: React.ElementType<React.HTMLAttributes<HTMLDivElement>>;
}

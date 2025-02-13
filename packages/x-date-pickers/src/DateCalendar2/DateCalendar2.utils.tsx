import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import { DAY_MARGIN, DAY_SIZE } from '../internals/constants/dimensions';
import { useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { DateView } from '../models/views';

export const DAYS_GRID_BODY_HEIGHT = (DAY_SIZE + DAY_MARGIN * 2) * 6;

const DateCalendar2LoadingPanelContainer = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'LoadingPanelContainer',
  overridesResolver: (_, styles) => styles.loadingPanelContainer,
})({
  display: 'flex',
  justifyContent: 'center',
  flex: '1 1 auto',
  '&[data-view="day"]': {
    minHeight: DAYS_GRID_BODY_HEIGHT,
  },
});

// TODO: Remove once we have implemented a good loading panel for each view
const DateCalendar2MonthOrYearLoadingPanel = styled((props) => <div {...props}>...</div>, {
  name: 'MuiDateCalendar2',
  slot: 'MonthOrYearLoadingPanel',
  overridesResolver: (_, styles) => styles.monthOrYearLoading,
})({});

export function useLoadingPanel(parameters: UseLoadingPanelParameters) {
  const { view, defaultComponent: DefaultComponent = DateCalendar2MonthOrYearLoadingPanel } =
    parameters;
  const { classes, slots, slotProps } = useDateCalendar2PrivateContext();
  const { ownerState } = usePickerPrivateContext();
  const LoadingPanel = slots?.loadingPanel ?? DefaultComponent;
  const loadingPanelProps = useSlotProps({
    elementType: LoadingPanel,
    externalSlotProps: slotProps?.loadingPanel,
    ownerState,
    className: classes.loadingPanel,
  });

  const renderLoadingPanel = () => (
    <DateCalendar2LoadingPanelContainer data-view={view}>
      <LoadingPanel {...loadingPanelProps} />
    </DateCalendar2LoadingPanelContainer>
  );

  return renderLoadingPanel;
}

interface UseLoadingPanelParameters {
  view: DateView;
  defaultComponent?: React.ElementType;
}

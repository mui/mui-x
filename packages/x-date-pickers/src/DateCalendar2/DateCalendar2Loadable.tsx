import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import { useDateCalendar2Context, useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { DAYS_GRID_BODY_HEIGHT } from './DateCalendar2.utils';

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

const DateCalendar2MonthOrYearLoadingPanel = styled((props) => <div {...props}>...</div>, {
  name: 'MuiDateCalendar2',
  slot: 'MonthOrYearLoadingPanel',
  overridesResolver: (_, styles) => styles.monthOrYearLoading,
})({});

export function DateCalendar2Loadable(props: DateCalendar2LoadableProps) {
  const { children, defaultComponent } = props;
  const { loading } = useDateCalendar2PrivateContext();
  const { view } = useDateCalendar2Context();

  if (loading) {
    return (
      <DateCalendar2LoadingPanelContainer data-view={view}>
        <WrappedDateCalendar2LoadingPanel defaultComponent={defaultComponent} />
      </DateCalendar2LoadingPanelContainer>
    );
  }

  return children;
}

function WrappedDateCalendar2LoadingPanel(props: WrappedDateCalendar2LoadingPanelProps) {
  const { defaultComponent: DateCalendar2LoadingPanel = DateCalendar2MonthOrYearLoadingPanel } =
    props;
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

interface DateCalendar2LoadableProps extends WrappedDateCalendar2LoadingPanelProps {
  children: React.ReactNode;
}

interface WrappedDateCalendar2LoadingPanelProps {
  defaultComponent?: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
}

import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import { useDateCalendar2Context } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { DAYS_GRID_BODY_HEIGHT } from './DateCalendar2.utils';
import { DateView } from '../models/views';

const DateCalendar2LoadingPanelContainer = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'LoadingPanelContainer',
  overridesResolver: (_, styles) => styles.loadingPanelContainer,
})({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&[data-view="day"]': {
    minHeight: DAYS_GRID_BODY_HEIGHT,
  },
});

const DateCalendar2LoadingPanel = styled((props) => <div {...props}>...</div>, {
  name: 'MuiDateCalendar2',
  slot: 'LoadingPanel',
  overridesResolver: (_, styles) => styles.loadingPanel,
})({});

export function DateCalendar2Loadable(props: DateCalendar2LoadableProps) {
  const { children, view } = props;
  const { loading } = useDateCalendar2Context();

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
  const { classes, slots, slotProps } = useDateCalendar2Context();

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

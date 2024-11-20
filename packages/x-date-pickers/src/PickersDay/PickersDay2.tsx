import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { PickersDayProps } from './PickersDay.types';

const noop = () => {};

type PickersDay2Component = ((
  props: PickersDayProps & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

const PickersDayRaw = React.forwardRef(function PickersDay2(
  inProps: PickersDayProps,
  forwardedRef: React.Ref<HTMLButtonElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersDay2',
  });

  const {
    autoFocus = false,
    className,
    day,
    disabled = false,
    disableHighlightToday = false,
    disableMargin = false,
    hidden,
    isAnimating,
    onClick,
    onDaySelect,
    onFocus = noop,
    onBlur = noop,
    onKeyDown = noop,
    onMouseDown = noop,
    onMouseEnter = noop,
    outsideCurrentMonth,
    selected = false,
    showDaysOutsideCurrentMonth = false,
    children,
    today: isToday = false,
    isFirstVisibleCell,
    isLastVisibleCell,
    ...other
  } = props;

  return <></>;
});

export const PickersDay = React.memo(PickersDayRaw) as PickersDay2Component;

import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import { Calendar } from '../internals/base/Calendar';
import { DIALOG_WIDTH, MAX_CALENDAR_HEIGHT } from '../internals/constants/dimensions';
import { useDateCalendar2Context } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

const DateCalendar2YearsGridRoot = styled(Calendar.YearsGrid, {
  name: 'MuiDateCalendar2',
  slot: 'YearsGridRoot',
  overridesResolver: (props, styles) => styles.yearsGridRoot,
})({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  rowGap: 12,
  columnGap: 24,
  padding: '6px 0',
  overflowY: 'auto',
  height: '100%',
  width: DIALOG_WIDTH,
  maxHeight: MAX_CALENDAR_HEIGHT,
  // avoid padding increasing width over defined
  boxSizing: 'border-box',
  position: 'relative',
});

const DateCalendar2YearsCell = styled('button', {
  name: 'MuiDateCalendar2',
  slot: 'YearsCell',
  overridesResolver: (props, styles) => styles.yearsCell,
})(({ theme }) => ({
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  ...theme.typography.subtitle1,
  height: 36,
  width: 72,
  borderRadius: 18,
  cursor: 'pointer',
  '&:focus': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.focusOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.focusOpacity),
  },
  '&:hover': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  '&:disabled': {
    cursor: 'auto',
    pointerEvents: 'none',
  },
  '&[data-disabled]': {
    color: (theme.vars || theme).palette.text.secondary,
  },
  '&[data-selected]': {
    color: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
}));

function WrappedYearsButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  const { ownerState } = usePickerPrivateContext();
  const { classes, slots, slotProps } = useDateCalendar2Context();

  const YearsButton = slots?.yearButton ?? DateCalendar2YearsCell;
  const yearsButtonProps = useSlotProps({
    elementType: YearsButton,
    externalSlotProps: slotProps?.yearButton,
    externalForwardedProps: props,
    className: classes.yearsCell,
    ownerState,
  });

  return <DateCalendar2YearsCell {...yearsButtonProps} />;
}

export function DateCalendar2YearsGrid(props: DateCalendarYearsGridProps) {
  const { yearsOrder, cellsPerRow } = props;
  const { classes } = useDateCalendar2Context();

  const getItems = React.useMemo<Calendar.YearsGrid.Props['getItems']>(() => {
    if (yearsOrder === 'asc') {
      return undefined;
    }

    return ({ getDefaultItems }) => {
      return getDefaultItems().toReversed();
    };
  }, [yearsOrder]);

  return (
    <DateCalendar2YearsGridRoot
      getItems={getItems}
      cellsPerRow={cellsPerRow}
      className={classes.yearsGridRoot}
    >
      {({ years }) =>
        years.map((year) => (
          <Calendar.YearsCell render={<WrappedYearsButton />} value={year} key={year.toString()} />
        ))
      }
    </DateCalendar2YearsGridRoot>
  );
}

interface DateCalendarYearsGridProps extends Pick<Calendar.YearsGrid.Props, 'cellsPerRow'> {
  yearsOrder: 'asc' | 'desc';
}

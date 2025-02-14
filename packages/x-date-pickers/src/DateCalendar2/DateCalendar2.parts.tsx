import * as React from 'react';
import TransitionGroup, { TransitionGroupProps } from 'react-transition-group/TransitionGroup';
import { alpha, styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {
  DAY_MARGIN,
  DAY_SIZE,
  DIALOG_WIDTH,
  MAX_CALENDAR_HEIGHT,
} from '../internals/constants/dimensions';
import { Calendar } from '../internals/base/Calendar';
import { DAYS_GRID_BODY_HEIGHT } from './DateCalendar2.utils';
import { ArrowDropDownIcon } from '../icons';

export const DaysCalendar2DayGridRoot = styled(Calendar.DayGrid, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridRoot',
  overridesResolver: (props, styles) => styles.dayGridRoot,
})({});

export const DateCalendar2DayGridHeader = styled(Calendar.DayGridHeader, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridHeader',
  overridesResolver: (props, styles) => styles.dayGridHeader,
})({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const DateCalendar2DayGridWeekNumberHeaderCell = styled(Typography, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridWeekNumberHeaderCell',
  overridesResolver: (props, styles) => styles.dayGridWeekNumberHeaderCell,
})(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.disabled,
}));

export const DateCalendar2DayGridHeaderCell = styled(Typography, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridHeaderCell',
  overridesResolver: (props, styles) => styles.dayGridHeaderCell,
})(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: (theme.vars || theme).palette.text.secondary,
}));

export const DateCalendar2DayGridBodyNoTransition = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'DayGridBodyNoTransition',
  overridesResolver: (props, styles) => styles.dayGridBodyNoTransition,
})({
  minHeight: DAYS_GRID_BODY_HEIGHT,
});

export const DateCalendar2DayGridBodyTransitionGroup = styled(TransitionGroup, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridBodyTransitionGroup',
  overridesResolver: (props, styles) => styles.dayGridBodyTransitionGroup,
})<TransitionGroupProps>(({ theme }) => {
  const slideTransition = theme.transitions.create('transform', {
    duration: theme.transitions.duration.complex,
    easing: 'cubic-bezier(0.35, 0.8, 0.4, 1)',
  });
  return {
    minHeight: DAYS_GRID_BODY_HEIGHT,
    display: 'block',
    position: 'relative',
    overflow: 'hidden',
    '& > *': {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
    },
    '& .day-grid-enter-left': {
      willChange: 'transform',
      transform: 'translate(100%)',
      zIndex: 1,
    },
    '& .day-grid-enter-right': {
      willChange: 'transform',
      transform: 'translate(-100%)',
      zIndex: 1,
    },
    '& .day-grid-enter-active': {
      transform: 'translate(0%)',
      transition: slideTransition,
    },
    '& .day-grid-exit': {
      transform: 'translate(0%)',
    },
    '& .day-grid-exit-active-left': {
      willChange: 'transform',
      transform: 'translate(-100%)',
      transition: slideTransition,
      zIndex: 0,
    },
    '& .day-grid-exit-active-right': {
      willChange: 'transform',
      transform: 'translate(100%)',
      transition: slideTransition,
      zIndex: 0,
    },
  };
});

export const DateCalendar2DayGridBody = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'DayGridBody',
  overridesResolver: (props, styles) => styles.dayGridBody,
})({ overflow: 'hidden' });

export const DateCalendar2DayGridRow = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'DayGridRow',
  overridesResolver: (props, styles) => styles.dayGridRow,
})({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});

export const DateCalendar2DayGridWeekNumberCell = styled(Typography, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridWeekNumberCell',
  overridesResolver: (props, styles) => styles.dayGridWeekNumberCell,
})(({ theme }) => ({
  ...theme.typography.caption,
  width: DAY_SIZE,
  height: DAY_SIZE,
  padding: 0,
  margin: `0 ${DAY_MARGIN}px`,
  color: theme.palette.text.disabled,
  fontSize: '0.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'inline-flex',
}));

export const DateCalendar2DayCell = styled((props) => <ButtonBase centerRipple {...props} />, {
  name: 'MuiDateCalendar2',
  slot: 'DayCell',
  overridesResolver: (props, styles) => styles.dayCell,
})(({ theme }) => ({
  ...theme.typography.caption,
  width: DAY_SIZE,
  height: DAY_SIZE,
  borderRadius: '50%',
  padding: 0,
  margin: `0 ${DAY_MARGIN}px`,

  // explicitly setting to `transparent` to avoid potentially getting impacted by change from the overridden component
  backgroundColor: 'transparent',
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.short,
  }),
  color: (theme.vars || theme).palette.text.primary,
  '@media (pointer: fine)': {
    '&:hover': {
      backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.hoverOpacity})`
        : alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
    },
  },
  '&:focus': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.focusOpacity})`
      : alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
    '&[data-selected]': {
      willChange: 'background-color',
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
  '&[data-selected]': {
    color: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      willChange: 'background-color',
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
  '&[data-disabled]:not([data-selected])': {
    color: (theme.vars || theme).palette.text.disabled,
  },
  '&[data-disabled][data-selected]': {
    opacity: 0.6,
  },
  '&[data-outside-month]': {
    color: (theme.vars || theme).palette.text.secondary,
    pointerEvents: 'none',
  },
  '&[data-current]:not([data-selected])': {
    border: `1px solid ${(theme.vars || theme).palette.text.secondary}`,
  },
}));

export const DateCalendar2DayCellSkeleton = styled(Skeleton, {
  name: 'MuiDateCalendar2',
  slot: 'DayCellSkeleton',
  overridesResolver: (props, styles) => styles.dayCellSkeleton,
})({
  width: DAY_SIZE,
  height: DAY_SIZE,
  margin: `0 ${DAY_MARGIN}px`,
  '&[data-outside-month="true"]': {
    visibility: 'hidden',
  },
});

export const DateCalendar2MonthGridRoot = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'MonthGridRoot',
  overridesResolver: (props, styles) => styles.monthGridRoot,
})({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  rowGap: 16,
  columnGap: 24,
  padding: '8px 0',
  width: DIALOG_WIDTH,
  // avoid padding increasing width over defined
  boxSizing: 'border-box',
  '&[data-cells-per-row="4"]': {
    columnGap: 0,
  },
});

export const DateCalendar2MonthCell = styled('button', {
  name: 'MuiDateCalendar2',
  slot: 'MonthCell',
  overridesResolver: (props, styles) => styles.monthCell,
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
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
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

export const DateCalendar2MonthCellSkeleton = styled(Skeleton, {
  name: 'MuiDateCalendar2',
  slot: 'MonthCellSkeleton',
  overridesResolver: (props, styles) => styles.monthCellSkeleton,
})({
  height: 36,
  width: 72,
});

export const DateCalendar2YearGridRoot = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'YearGridRoot',
  overridesResolver: (props, styles) => styles.yearGridRoot,
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
  '&[data-cells-per-row="4"]': {
    columnGap: 0,
    padding: '0 2px',
  },
});

export const DateCalendar2YearCell = styled('button', {
  name: 'MuiDateCalendar2',
  slot: 'YearCell',
  overridesResolver: (props, styles) => styles.yearCell,
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

export const DateCalendar2YearCellSkeleton = styled(Skeleton, {
  name: 'MuiDateCalendar2',
  slot: 'YearCellSkeleton',
  overridesResolver: (props, styles) => styles.yearCellSkeleton,
})({
  height: 36,
  width: 72,
});

export const DateCalendar2HeaderRoot = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderRoot',
  overridesResolver: (props, styles) => styles.headerRoot,
})({
  display: 'flex',
  alignItems: 'center',
  marginTop: 12,
  marginBottom: 4,
  paddingLeft: 24,
  paddingRight: 12,
  // prevent jumping in safari
  maxHeight: 40,
  minHeight: 40,
});

export const DateCalendar2HeaderLabelContainer = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderLabelContainer',
  overridesResolver: (props, styles) => styles.headerLabelContainer,
})(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: 'auto',
  ...theme.typography.body1,
  fontWeight: theme.typography.fontWeightMedium,
}));

export const DateCalendar2HeaderLabelTransitionGroup = styled(TransitionGroup, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderLabelTransitionGroup',
  overridesResolver: (props, styles) => styles.headerLabelTransitionGroup,
})({
  display: 'block',
  position: 'relative',
});

export const DateCalendar2HeaderLabelContent = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderLabelContent',
  overridesResolver: (props, styles) => styles.headerLabelContent,
})({
  marginRight: 6,
});

export const DateCalendar2HeaderSwitchViewButton = styled(IconButton, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderSwitchViewButton',
  overridesResolver: (props, styles) => styles.headerSwitchViewButton,
})({
  marginRight: 'auto',
});

export const DateCalendar2HeaderSwitchViewIcon = styled(ArrowDropDownIcon, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderSwitchViewIcon',
  overridesResolver: (props, styles) => styles.headerSwitchViewIcon,
})(({ theme }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
  '&[data-view="year"]': {
    transform: 'rotate(180deg)',
  },
}));

export const DateCalendar2HeaderNavigation = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderNavigation',
  overridesResolver: (props, styles) => styles.headerNavigation,
})({
  display: 'flex',
});

export const DateCalendar2HeaderNavigationButton = styled(IconButton, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderNavigationButton',
  overridesResolver: (props, styles) => styles.headerNavigationButton,
})({
  '&:disabled': {
    visibility: 'hidden',
  },
});

export const DateCalendar2HeaderNavigationSpacer = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderNavigationSpacer',
  overridesResolver: (props, styles) => styles.headerNavigationSpacer,
})(({ theme }) => ({
  width: theme.spacing(3),
}));

export const DateCalendar2LoadingPanelContainer = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'LoadingPanelContainer',
  overridesResolver: (_, styles) => styles.loadingPanelContainer,
})({
  display: 'flex',
  justifyContent: 'center',
  flex: '1 1 auto',
});

// TODO: Remove once we have implemented a good loading panel for each view
export const DateCalendar2MonthOrYearLoadingPanel = styled((props) => <div {...props}>...</div>, {
  name: 'MuiDateCalendar2',
  slot: 'MonthOrYearLoadingPanel',
  overridesResolver: (_, styles) => styles.monthOrYearLoading,
})({});

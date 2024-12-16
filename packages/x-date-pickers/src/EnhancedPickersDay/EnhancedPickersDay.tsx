import * as React from 'react';
import clsx from 'clsx';
import { alpha, styled, useThemeProps, Theme, CSSInterpolation } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import {
  unstable_useEnhancedEffect as useEnhancedEffect,
  unstable_composeClasses as composeClasses,
  unstable_useForkRef as useForkRef,
} from '@mui/utils';
import { useUtils } from '../internals/hooks/useUtils';
import { DAY_MARGIN, DAY_SIZE } from '../internals/constants/dimensions';
import {
  enhancedPickersDayClasses,
  getEnhancedPickersDayUtilityClass,
} from './enhancedPickersDayClasses';
import { EnhancedPickersDayProps, OwnerState } from './EnhancedPickersDay.types';
import zIndex from '@mui/material/styles/zIndex';
import { boxSizing } from '@mui/system';

const useUtilityClasses = (ownerState: OwnerState) => {
  const {
    selected,
    disableHighlightToday,
    today,
    disabled,
    outsideCurrentMonth,
    isDayHidden,
    isStartOfPreviewing,
    isEndOfPreviewing,
    isPreviewing,
    isStartOfSelectedRange,
    isEndOfSelectedRange,
    isWithinSelectedRange,
    isDragSelected,
  } = ownerState;

  const slots = {
    root: [
      'root',
      selected && !isDayHidden && 'selected',
      disabled && 'disabled',
      !disableHighlightToday && today && !selected && !isDayHidden && 'today',
      outsideCurrentMonth && 'dayOutsideMonth',
      isDayHidden && 'hiddenDay',
      isStartOfPreviewing && 'startOfPreviewing',
      isEndOfPreviewing && 'endOfPreviewing',
      isPreviewing && 'previewing',
      isStartOfSelectedRange && 'startOfSelectedRange',
      isEndOfSelectedRange && 'endOfSelectedRange',
      isWithinSelectedRange && 'withinSelectedRange',
      isDragSelected && 'dragSelected',
    ],
  };

  return composeClasses(slots, getEnhancedPickersDayUtilityClass, {});
};

const overridesResolver = (props: { ownerState: any }, styles: Record<any, CSSInterpolation>) => {
  const { ownerState } = props;
  return [
    styles.root,
    !ownerState.disableHighlightToday && ownerState.today && styles.today,
    !ownerState.outsideCurrentMonth && styles.dayOutsideMonth,
    ownerState.isDayHidden && styles.hiddenDay,
    ownerState.isStartOfPreviewing && styles.startOfPreviewing,
    ownerState.isEndOfPreviewing && styles.endOfPreviewing,
    ownerState.isPreviewing && styles.previewing,
    ownerState.isStartOfSelectedRange && styles.startOfSelectedRange,
    ownerState.isEndOfSelectedRange && styles.endOfSelectedRange,
    ownerState.isWithinSelectedRange && styles.withinSelectedRange,
    ownerState.isDragSelected && styles.dragSelected,
  ];
};

const styleArg = ({ theme }: { theme: Theme }) => ({
  ...theme.typography.caption,
  boxSizing: 'border-box',
  width: DAY_SIZE,
  height: DAY_SIZE,
  borderRadius: '50%',
  padding: 0,
  // explicitly setting to `transparent` to avoid potentially getting impacted by change from the overridden component
  backgroundColor: 'transparent',
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.short,
  }),
  color: (theme.vars || theme).palette.text.primary,
  border: '1px solid transparent',

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
  },
  [`&.${enhancedPickersDayClasses.selected}`]: {
    color: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '&:focus': {
      willChange: 'background-color',
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
    '&:hover': {
      willChange: 'background-color',
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
    [`&.${enhancedPickersDayClasses.disabled}`]: {
      opacity: 0.6,
    },
  },
  [`&.${enhancedPickersDayClasses.disabled}:not(.${enhancedPickersDayClasses.selected})`]: {
    color: (theme.vars || theme).palette.text.disabled,
  },
  [`&.${enhancedPickersDayClasses.hiddenDay}`]: {
    visibility: 'hidden',
  },
  [`&.${enhancedPickersDayClasses.dayOutsideMonth}`]: {
    color: (theme.vars || theme).palette.text.secondary,
  },
  [`&.${enhancedPickersDayClasses.today}`]: {
    borderColor: (theme.vars || theme).palette.text.secondary,
  },
  [`&.${enhancedPickersDayClasses.startOfPreviewing}`]: {},
  [`&.${enhancedPickersDayClasses.endOfPreviewing}`]: {},
  [`&.${enhancedPickersDayClasses.previewing}`]: {},
  [`&.${enhancedPickersDayClasses.startOfSelectedRange}`]: {},
  [`&.${enhancedPickersDayClasses.endOfSelectedRange}`]: {},
  [`&.${enhancedPickersDayClasses.withinSelectedRange}`]: {
    '::before': {
      zIndex: -1,
      content: '""' /* Creates an empty element */,
      position: 'absolute',
      width: `${DAY_SIZE / 2 + DAY_MARGIN}px`,
      height: `${DAY_SIZE}px`,
      background: '#839dd2',
      left: -(DAY_MARGIN + 1) /* Positions the pseudo-element 20px to the left */,
      top: -1 /* Aligns the top of the pseudo-element with the top of the div */,
    },
    '::after': {
      zIndex: -1,
      width: `${DAY_SIZE / 2 + DAY_MARGIN}px`,
      height: `${DAY_SIZE}px`,
      content: '""' /* Creates an empty element */,
      position: 'absolute',
      background: '#6739ff',
      right: -(DAY_MARGIN + 1) /* Positions the pseudo-element 20px to the left */,
      top: -1 /* Aligns the top of the pseudo-element with the top of the div */,
    },
  },
  [`&.${enhancedPickersDayClasses.dragSelected}`]: {},
});

const EnhancedPickersDayRoot = styled(ButtonBase, {
  name: 'MuiEnhancedPickersDay',
  slot: 'Root',
  overridesResolver,
})<{ ownerState: any }>(styleArg);

type EnhancedPickersDayComponent = ((
  props: EnhancedPickersDayProps & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

const noop = () => {};

const EnhancedPickersDayRaw = React.forwardRef(function EnhancedPickersDay(
  inProps: EnhancedPickersDayProps,
  forwardedRef: React.Ref<HTMLButtonElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiEnhancedPickersDay',
  });

  const {
    autoFocus = false,
    className,
    day,
    disabled = false,
    disableHighlightToday = false,
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
    dayOfWeek,
    isStartOfPreviewing = false,
    isEndOfPreviewing = false,
    isPreviewing = false,
    isStartOfSelectedRange = false,
    isEndOfSelectedRange = false,
    isWithinSelectedRange = false,
    isDragSelected = false,
    ...other
  } = props;

  const ownerState = {
    selected,
    disableHighlightToday,
    today: isToday,
    disabled,
    isDayHidden: outsideCurrentMonth && !showDaysOutsideCurrentMonth,
    outsideCurrentMonth: outsideCurrentMonth && showDaysOutsideCurrentMonth,
    firstDayOfWeek: dayOfWeek === 1,
    lastDayOfWeek: dayOfWeek === 7,
    isStartOfPreviewing,
    isEndOfPreviewing,
    isPreviewing,
    isStartOfSelectedRange,
    isEndOfSelectedRange,
    isWithinSelectedRange,
    isDragSelected,
  };

  const classes = useUtilityClasses(ownerState);

  const utils = useUtils();

  const ref = React.useRef<HTMLButtonElement>(null);
  const handleRef = useForkRef(ref, forwardedRef);

  // Since this is rendered when a Popper is opened we can't use passive effects.
  // Focusing in passive effects in Popper causes scroll jump.
  useEnhancedEffect(() => {
    if (autoFocus && !disabled && !isAnimating && !outsideCurrentMonth) {
      // ref.current being null would be a bug in MUI
      ref.current!.focus();
    }
  }, [autoFocus, disabled, isAnimating, outsideCurrentMonth]);

  // For a day outside the current month, move the focus from mouseDown to mouseUp
  // Goal: have the onClick ends before sliding to the new month
  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMouseDown(event);
    if (outsideCurrentMonth) {
      event.preventDefault();
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onDaySelect(day);
    }

    if (outsideCurrentMonth) {
      event.currentTarget.focus();
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <EnhancedPickersDayRoot
      ref={handleRef}
      centerRipple
      data-testid="day"
      disabled={disabled}
      tabIndex={selected ? 0 : -1}
      onKeyDown={(event) => onKeyDown(event, day)}
      onFocus={(event) => onFocus(event, day)}
      onBlur={(event) => onBlur(event, day)}
      onMouseEnter={(event) => onMouseEnter(event, day)}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      {...other}
      ownerState={ownerState}
      className={clsx(classes.root, className)}
    >
      {!children ? utils.format(day, 'dayOfMonth') : children}
    </EnhancedPickersDayRoot>
  );
});

export const EnhancedPickersDay = React.memo(EnhancedPickersDayRaw) as EnhancedPickersDayComponent;

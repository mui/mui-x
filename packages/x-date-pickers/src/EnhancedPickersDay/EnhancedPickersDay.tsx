import * as React from 'react';
import clsx from 'clsx';
import { alpha, styled, useThemeProps, CSSInterpolation } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import {
  unstable_useEnhancedEffect as useEnhancedEffect,
  unstable_composeClasses as composeClasses,
  unstable_useForkRef as useForkRef,
} from '@mui/utils';
import { useUtils } from '../internals/hooks/useUtils';
import { DAY_MARGIN } from '../internals/constants/dimensions';
import {
  enhancedPickersDayClasses,
  getEnhancedPickersDayUtilityClass,
} from './enhancedPickersDayClasses';
import { EnhancedPickersDayProps, PickersDayOwnerState } from './EnhancedPickersDay.types';

const DAY_SIZE = 40;

const useUtilityClasses = (ownerState: PickersDayOwnerState) => {
  const {
    isSelected,
    isHighlightTodayDisabled,
    isToday,
    isDisabled,
    isOutsideCurrentMonth,
    isDayHidden,
    isStartOfPreviewing,
    isEndOfPreviewing,
    isPreviewing,
    isStartOfSelectedRange,
    isEndOfSelectedRange,
    isWithinSelectedRange,
    isDragSelected,
    isFirstDayOfWeek,
    isLastDayOfWeek,
  } = ownerState;

  const slots = {
    root: [
      'root',
      isSelected && !isDayHidden && 'selected',
      isDisabled && 'disabled',
      !isHighlightTodayDisabled && isToday && !isSelected && !isDayHidden && 'today',
      isOutsideCurrentMonth && 'dayOutsideMonth',
      isDayHidden && 'hiddenDay',
      isStartOfPreviewing && 'startOfPreviewing',
      isEndOfPreviewing && 'endOfPreviewing',
      isPreviewing && 'previewing',
      isStartOfSelectedRange && 'startOfSelectedRange',
      isEndOfSelectedRange && 'endOfSelectedRange',
      isWithinSelectedRange && 'withinSelectedRange',
      isDragSelected && 'dragSelected',
      isLastDayOfWeek && 'lastDayOfWeek',
      isFirstDayOfWeek && 'firstDayOfWeek',
    ],
  };

  return composeClasses(slots, getEnhancedPickersDayUtilityClass, {});
};

const overridesResolver = (props: { ownerState: any }, styles: Record<any, CSSInterpolation>) => {
  const { ownerState } = props;
  return [
    styles.root,
    !ownerState.isHighlightTodayDisabled && ownerState.today && styles.today,
    !ownerState.isOutsideCurrentMonth && styles.dayOutsideMonth,
    ownerState.isDayHidden && styles.hiddenDay,
    ownerState.isStartOfPreviewing && styles.startOfPreviewing,
    ownerState.isEndOfPreviewing && styles.endOfPreviewing,
    ownerState.isPreviewing && styles.previewing,
    ownerState.isStartOfSelectedRange && styles.startOfSelectedRange,
    ownerState.isEndOfSelectedRange && styles.endOfSelectedRange,
    ownerState.isWithinSelectedRange && styles.withinSelectedRange,
    ownerState.isDragSelected && styles.dragSelected,
    ownerState.isFirstDayOfWeek && styles.firstDayOfWeek,
    ownerState.isLastDayOfWeek && styles.lastDayOfWeek,
  ];
};

const SET_MARGIN = DAY_MARGIN; // should be working with any given margin
const highlightStyles = (theme) => ({
  zIndex: -1,
  content: '""' /* Creates an empty element */,
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.focusOpacity})`
    : alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
  boxSizing: 'content-box',
});
const previewStyles = (theme) => ({
  zIndex: -1,
  content: '""' /* Creates an empty element */,
  position: 'absolute',
  width: 'calc(100% - 2px)',
  height: 'calc(100% - 2px)',
  border: `1px dashed ${(theme.vars || theme).palette.divider}`,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  boxSizing: 'content-box',
});

const selectedDayStyles = (theme) => ({
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
});

const styleArg = ({ theme }) => ({
  ...theme.typography.caption,
  width: DAY_SIZE,
  height: DAY_SIZE,
  borderRadius: '50%',
  padding: 0,
  marginLeft: SET_MARGIN,
  marginRight: SET_MARGIN,
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
  },

  variants: [
    {
      props: { isSelected: true },
      style: {
        ...selectedDayStyles(theme),
      },
    },
    {
      props: { isDisabled: true },
      style: {
        color: (theme.vars || theme).palette.text.disabled,
      },
    },
    {
      props: { isDayHidden: true },
      style: {
        visibility: 'hidden',
      },
    },
    {
      props: { isOutsideCurrentMonth: true },
      style: {
        color: (theme.vars || theme).palette.text.secondary,
      },
    },
    {
      props: {
        isToday: true,
        isSelected: false,
      },
      style: {
        outline: `1px solid ${(theme.vars || theme).palette.text.secondary}`,
        outlineOffset: -1,
      },
    },
    {
      props: { isStartOfPreviewing: true },
      style: {
        '::after': {
          ...previewStyles(theme),
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
          paddingRight: SET_MARGIN,
          left: 0,
        },
      },
    },
    {
      props: { isStartOfPreviewing: true, isEndOfSelectedRange: false },
      style: {
        '::after': {
          borderLeftColor: (theme.vars || theme).palette.divider,
        },
      },
    },

    {
      props: { isEndOfPreviewing: true },
      style: {
        '::after': {
          ...previewStyles(theme),
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
          paddingLeft: SET_MARGIN,
          right: 0,
        },
      },
    },
    {
      props: { isEndOfPreviewing: true, isStartOfSelectedRange: false },
      style: {
        '::after': {
          borderRightColor: (theme.vars || theme).palette.divider,
        },
      },
    },

    {
      props: { isPreviewing: true },
      style: {
        '::after': {
          ...previewStyles(theme),
          paddingLeft: SET_MARGIN,
          paddingRight: SET_MARGIN,
        },
      },
    },

    {
      props: { isStartOfSelectedRange: true },
      style: {
        '::before': {
          ...highlightStyles(theme),
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
          paddingRight: SET_MARGIN,
          left: 0,
        },
      },
    },
    {
      props: { isEndOfSelectedRange: true },
      style: {
        '::before': {
          ...highlightStyles(theme),
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
          paddingLeft: SET_MARGIN,
          right: 0,
        },
      },
    },
    {
      props: { isWithinSelectedRange: true },
      style: {
        '::before': {
          ...highlightStyles(theme),
          paddingLeft: SET_MARGIN,
          paddingRight: SET_MARGIN,
        },
      },
    },
    {
      props: { isDragSelected: true },
      style: {
        ...selectedDayStyles(theme),
      },
    },
    {
      props: { isLastDayOfWeek: true },
      style: {
        '::after': {
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
          borderRightColor: (theme.vars || theme).palette.divider,
          paddingRight: 0,
          right: 0,
        },
        '::before': {
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
          paddingRight: 0,
          right: 0,
        },
      },
    },
    {
      props: {
        isFirstDayOfWeek: true,
      },
      style: {
        '::after': {
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
          borderLeftColor: (theme.vars || theme).palette.divider,
          paddingLeft: 0,
          left: 0,
        },
        '::before': {
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
          paddingLeft: 0,
          left: 0,
        },
      },
    },
  ],
});

const EnhancedPickersDayRoot = styled(ButtonBase, {
  name: 'MuiEnhancedPickersDay',
  slot: 'Root',
  overridesResolver,
})<{ ownerState: PickersDayOwnerState }>(styleArg);

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

  console.log('EnhancedPickersDay', props);

  const ownerState = {
    isSelected: selected,
    isHighlightTodayDisabled: disableHighlightToday,
    isToday,
    isDisabled: disabled,
    isDayHidden: outsideCurrentMonth && !showDaysOutsideCurrentMonth,
    isOutsideCurrentMonth: outsideCurrentMonth && showDaysOutsideCurrentMonth,
    isFirstDayOfWeek: dayOfWeek === 1,
    isLastDayOfWeek: dayOfWeek === 7,
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

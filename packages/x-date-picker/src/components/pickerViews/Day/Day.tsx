import * as React from 'react';
import clsx from 'clsx';
import { CSSInterpolation } from '@mui/system';
import ButtonBase from '@mui/material/ButtonBase';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import {
  unstable_composeClasses as composeClasses,
} from '@mui/base';
import { useTheme, alpha, styled, useThemeProps, Theme } from '@mui/material/styles';
import { useForkRef } from '@mui/material/utils';
import { useDateUtils } from '../../../hooks/utils/useDateUtils';
import { DAY_SIZE, DAY_MARGIN } from '../../../constants/dimensions';
import { DayProps } from './DayProps'
import {dayClasses, DayClassKey, getDayUtilityClass} from './dayClasses'

import { areDayPropsEqual } from './dayUtils'



type OwnerState = DayProps<any>

const useUtilityClasses = (ownerState: DayProps<any>) => {
  const {
    selected,
    disableMargin,
    disableHighlightToday,
    today,
    outsideCurrentMonth,
    showDaysOutsideCurrentMonth,
    classes,
  } = ownerState;

  const slots = {
    root: [
      'root',
      selected && 'selected',
      !disableMargin && 'dayWithMargin',
      !disableHighlightToday && today && 'today',
      outsideCurrentMonth && showDaysOutsideCurrentMonth && 'dayOutsideMonth',
    ],
    hiddenDaySpacingFiller: ['hiddenDaySpacingFiller'],
  };

  return composeClasses(slots, getDayUtilityClass, classes);
};

const styleArg = ({ theme, ownerState }: { theme: Theme; ownerState: OwnerState }) => ({
  ...theme.typography.caption,
  width: DAY_SIZE,
  height: DAY_SIZE,
  borderRadius: '50%',
  padding: 0,
  // background required here to prevent collides with the other days when animating with transition group
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  '&:focus': {
    backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
    [`&.${dayClasses.selected}`]: {
      willChange: 'background-color',
      backgroundColor: theme.palette.primary.dark,
    },
  },
  [`&.${dayClasses.selected}`]: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      willChange: 'background-color',
      backgroundColor: theme.palette.primary.dark,
    },
  },
  [`&.${dayClasses.disabled}`]: {
    color: theme.palette.text.disabled,
  },
  ...(!ownerState.disableMargin && {
    margin: `0 ${DAY_MARGIN}px`,
  }),
  ...(ownerState.outsideCurrentMonth &&
    ownerState.showDaysOutsideCurrentMonth && {
      color: theme.palette.text.secondary,
    }),
  ...(!ownerState.disableHighlightToday &&
    ownerState.today && {
      [`&:not(.${dayClasses.selected})`]: {
        border: `1px solid ${theme.palette.text.secondary}`,
      },
    }),
});

const overridesResolver = (
  props: { ownerState: OwnerState },
  styles: Record<DayClassKey, CSSInterpolation>,
) => {
  const { ownerState } = props;
  return [
    styles.root,
    !ownerState.disableMargin && styles.dayWithMargin,
    !ownerState.disableHighlightToday && ownerState.today && styles.today,
    !ownerState.outsideCurrentMonth &&
      ownerState.showDaysOutsideCurrentMonth &&
      styles.dayOutsideMonth,
    ownerState.outsideCurrentMonth &&
      !ownerState.showDaysOutsideCurrentMonth &&
      styles.hiddenDaySpacingFiller,
  ];
};

const PickersDayRoot = styled(ButtonBase, {
  name: 'MuiPickersDay',
  slot: 'Root',
  overridesResolver,
})<{ ownerState: OwnerState }>(styleArg);

const PickersDayFiller = styled('div', {
  name: 'MuiPickersDay',
  slot: 'Root',
  overridesResolver,
})<{ ownerState: OwnerState }>(({ theme, ownerState }) => ({
  ...styleArg({ theme, ownerState }),
  visibility: 'hidden',
}));

const noop = () => {};

const InnerDay = React.forwardRef(function PickersDay<TDate>(
  inProps: DayProps<TDate>,
  forwardedRef: React.Ref<HTMLButtonElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersDay',
  });

  const {
    allowSameDateSelection = false,
    autoFocus = false,
    className,
    day,
    disabled = false,
    disableHighlightToday = false,
    disableMargin = false,
    hidden,
    isAnimating,
    onClick,
    onDayFocus = noop,
    onDaySelect,
    onFocus,
    onKeyDown,
    outsideCurrentMonth,
    selected = false,
    showDaysOutsideCurrentMonth = false,
    children,
    today: isToday = false,
    ...other
  } = props;

  const ownerState = {
    ...props,
    allowSameDateSelection,
    autoFocus,
    disabled,
    disableHighlightToday,
    disableMargin,
    selected,
    showDaysOutsideCurrentMonth,
    today: isToday,
  };

  const classes = useUtilityClasses(ownerState);

  const utils = useDateUtils<TDate>();
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

  const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    if (onDayFocus) {
      onDayFocus(day);
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!allowSameDateSelection && selected) {
      return;
    }

    if (!disabled) {
      onDaySelect(day, 'finish');
    }

    if (onClick) {
      onClick(event);
    }
  };

  const theme = useTheme();

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (onKeyDown !== undefined) {
      onKeyDown(event);
    }

    switch (event.key) {
      case 'ArrowUp':
        onDayFocus(utils.addDays(day, -7));
        event.preventDefault();
        break;
      case 'ArrowDown':
        onDayFocus(utils.addDays(day, 7));
        event.preventDefault();
        break;
      case 'ArrowLeft':
        onDayFocus(utils.addDays(day, theme.direction === 'ltr' ? -1 : 1));
        event.preventDefault();
        break;
      case 'ArrowRight':
        onDayFocus(utils.addDays(day, theme.direction === 'ltr' ? 1 : -1));
        event.preventDefault();
        break;
      case 'Home':
        onDayFocus(utils.startOfWeek(day));
        event.preventDefault();
        break;
      case 'End':
        onDayFocus(utils.endOfWeek(day));
        event.preventDefault();
        break;
      case 'PageUp':
        onDayFocus(utils.getNextMonth(day));
        event.preventDefault();
        break;
      case 'PageDown':
        onDayFocus(utils.getPreviousMonth(day));
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  if (outsideCurrentMonth && !showDaysOutsideCurrentMonth) {
    return (
      <PickersDayFiller
        className={clsx(classes.root, classes.hiddenDaySpacingFiller, className)}
        ownerState={ownerState}
      />
    );
  }

  return (
    <PickersDayRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={handleRef}
      centerRipple
      data-mui-test="day"
      disabled={disabled}
      aria-label={!children ? utils.format(day, 'fullDate') : undefined}
      tabIndex={selected ? 0 : -1}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      {...other}
    >
      {!children ? utils.format(day, 'dayOfMonth') : children}
    </PickersDayRoot>
  );
});

export const Day = React.memo(InnerDay, areDayPropsEqual) as <TDate>(
  props: DayProps<TDate> & React.RefAttributes<HTMLButtonElement>,
) => JSX.Element;

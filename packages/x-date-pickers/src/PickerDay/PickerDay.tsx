'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { alpha, styled, useThemeProps, CSSInterpolation } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import useForkRef from '@mui/utils/useForkRef';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { MuiEvent } from '@mui/x-internals/types';
import { DAY_MARGIN, DAY_SIZE } from '../internals/constants/dimensions';
import {
  pickerDayClasses,
  PickerDayClassKey,
  getPickerDayUtilityClass,
  PickerDayClasses,
} from './pickerDayClasses';
import { usePickerAdapter } from '../hooks/usePickerAdapter';
import { PickerDayOwnerState, PickerDayProps } from './PickerDay.types';
import { usePickerDayOwnerState } from '../internals/hooks/usePickerDayOwnerState';

const useUtilityClasses = (
  ownerState: PickerDayOwnerState,
  classes?: Partial<PickerDayClasses>,
) => {
  const {
    isDaySelected,
    disableHighlightToday,
    isDayCurrent,
    isDayDisabled,
    isDayOutsideMonth,
    isDayFillerCell,
  } = ownerState;

  const slots = {
    root: [
      'root',
      isDaySelected && !isDayFillerCell && 'selected',
      isDayDisabled && 'disabled',
      !disableHighlightToday && isDayCurrent && !isDaySelected && !isDayFillerCell && 'today',
      isDayOutsideMonth && 'dayOutsideMonth',
      isDayFillerCell && 'fillerCell',
    ],
  };

  return composeClasses(slots, getPickerDayUtilityClass, classes);
};

const PickerDayRoot = styled(ButtonBase, {
  name: 'MuiPickerDay',
  slot: 'Root',
  overridesResolver: (
    props: { ownerState: PickerDayOwnerState },
    styles: Record<PickerDayClassKey, CSSInterpolation>,
  ) => {
    const { ownerState } = props;
    return [
      styles.root,
      !ownerState.disableMargin && styles.dayWithoutMargin,
      !ownerState.disableHighlightToday && ownerState.isDayCurrent && styles.today,
      !ownerState.isDayOutsideMonth && styles.dayOutsideMonth,
      ownerState.isDayFillerCell && styles.fillerCell,
    ];
  },
})<{ ownerState: PickerDayOwnerState }>(({ theme }) => ({
  '--PickerDay-horizontalMargin': `${DAY_MARGIN}px`,
  '--PickerDay-size': `${DAY_SIZE}px`,
  ...theme.typography.caption,
  display: 'flex',
  width: 'var(--PickerDay-size)',
  height: 'var(--PickerDay-size)',
  borderRadius: 'calc(var(--PickerDay-size) / 2)',
  padding: 0,
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
  marginLeft: 'var(--PickerDay-horizontalMargin)',
  marginRight: 'var(--PickerDay-horizontalMargin)',
  variants: [
    {
      props: { isDaySelected: true },
      style: {
        color: (theme.vars || theme).palette.primary.contrastText,
        backgroundColor: (theme.vars || theme).palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
        '&:focus, &:hover': {
          willChange: 'background-color',
          backgroundColor: (theme.vars || theme).palette.primary.dark,
        },
        [`&.${pickerDayClasses.disabled}`]: {
          opacity: 0.6,
        },
      },
    },
    {
      props: { isDayDisabled: true },
      style: {
        color: (theme.vars || theme).palette.text.disabled,
      },
    },
    {
      props: { isDayFillerCell: true },
      style: {
        // visibility: 'hidden' does not work here as it hides the element from screen readers
        // and results in unexpected relationships between week day and day columns.
        opacity: 0,
        pointerEvents: 'none',
      },
    },
    {
      props: { isDayOutsideMonth: true },
      style: {
        color: (theme.vars || theme).palette.text.secondary,
      },
    },
    {
      props: { disableMargin: true },
      style: {
        marginLeft: 0,
        marginRight: 0,
      },
    },
    {
      props: {
        isDayCurrent: true,
        isDaySelected: false,
      },
      style: {
        outline: `1px solid ${(theme.vars || theme).palette.text.secondary}`,
        outlineOffset: -1,
      },
    },
  ],
}));

type PickerDayComponent = ((
  props: PickerDayProps & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

const noop = () => {};

const PickerDayRaw = React.forwardRef(function PickerDay(
  inProps: PickerDayProps,
  forwardedRef: React.Ref<HTMLButtonElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickerDay',
  });

  const adapter = usePickerAdapter();

  const {
    autoFocus = false,
    className,
    classes: classesProp,
    hidden,
    isAnimating,
    onClick,
    onDaySelect,
    onFocus = noop,
    onBlur = noop,
    onKeyDown = noop,
    onMouseDown = noop,
    onMouseEnter = noop,
    children,
    isFirstVisibleCell,
    isLastVisibleCell,
    day,
    selected,
    disabled,
    today,
    outsideCurrentMonth,
    disableMargin,
    disableHighlightToday,
    showDaysOutsideCurrentMonth,
    isVisuallySelected,
    ...other
  } = props;

  const pickerDayOwnerState = usePickerDayOwnerState({
    day,
    selected,
    disabled,
    today,
    outsideCurrentMonth,
    disableMargin,
    disableHighlightToday,
    showDaysOutsideCurrentMonth,
  });

  const ownerState: PickerDayOwnerState = {
    ...pickerDayOwnerState,
    // Properties specific to the MUI implementation (some might be removed in the next major)
    isDayFillerCell: outsideCurrentMonth && !showDaysOutsideCurrentMonth,
  };

  const classes = useUtilityClasses(ownerState, classesProp);

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

  const handleClick = (event: MuiEvent<React.MouseEvent<HTMLButtonElement>>) => {
    event.defaultMuiPrevented = true;
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
    <PickerDayRoot
      ref={handleRef}
      centerRipple
      disabled={disabled}
      tabIndex={selected ? 0 : -1}
      onKeyDown={(event) => onKeyDown(event, day)}
      onFocus={(event) => onFocus(event, day)}
      onBlur={(event) => onBlur(event, day)}
      onMouseEnter={(event) => onMouseEnter(event, day)}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      {...other}
      // compat with PickerDay for tests
      data-testid={
        ownerState.isDayFillerCell ? undefined : ((other as any)['data-testid'] ?? 'day')
      }
      ownerState={ownerState}
      className={clsx(classes.root, className)}
    >
      {/* `ownerState.isDayFillerCell` is used for compat with `PickerDay` for tests */}
      {children ?? (ownerState.isDayFillerCell ? null : adapter.format(day, 'dayOfMonth'))}
    </PickerDayRoot>
  );
});

PickerDayRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A ref for imperative actions.
   * It currently only supports `focusVisible()` action.
   */
  action: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        focusVisible: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * If `true`, the ripples are centered.
   * They won't start at the cursor interaction position.
   * @default false
   */
  centerRipple: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  component: PropTypes.elementType,
  /**
   * The date to show.
   */
  day: PropTypes.object.isRequired,
  /**
   * If `true`, the day is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, today's day is not highlighted.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * If `true`, the margin between days is disabled.
   * @default false
   */
  disableMargin: PropTypes.bool,
  /**
   * If `true`, the ripple effect is disabled.
   *
   * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
   * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
   * @default false
   */
  disableRipple: PropTypes.bool,
  /**
   * If `true`, the touch ripple effect is disabled.
   * @default false
   */
  disableTouchRipple: PropTypes.bool,
  /**
   * If `true`, the base button will have a keyboard focus ripple.
   * @default false
   */
  focusRipple: PropTypes.bool,
  /**
   * This prop can help identify which element has keyboard focus.
   * The class name will be applied when the element gains the focus through keyboard interaction.
   * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
   * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/HEAD/explainer.md).
   * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
   * if needed.
   */
  focusVisibleClassName: PropTypes.string,
  /**
   * If `true`, the day is being animated.
   * @default false
   */
  isAnimating: PropTypes.bool,
  /**
   * If `true`, the day is the first visible cell of the month.
   * @default false
   */
  isFirstVisibleCell: PropTypes.bool.isRequired,
  /**
   * If `true`, the day is the last visible cell of the month.
   * @default false
   */
  isLastVisibleCell: PropTypes.bool.isRequired,
  /**
   * Indicates if the day should be visually selected.
   */
  isVisuallySelected: PropTypes.bool,
  /**
   * The component used to render a link when the `href` prop is provided.
   * @default 'a'
   */
  LinkComponent: PropTypes.elementType,
  /**
   * Callback fired when the component is blurred.
   * @param {React.FocusEvent<HTMLButtonElement>} event The event object.
   * @param {PickerValidDate} day The day.
   * @default () => {}
   */
  onBlur: PropTypes.func,
  /**
   * Callback fired when the component is clicked.
   * @param {React.MouseEvent<HTMLButtonElement>} event The event object.
   * @default () => {}
   */
  onClick: PropTypes.func,
  /**
   * Callback fired when the day is selected.
   * @param {PickerValidDate} day The day to select.
   */
  onDaySelect: PropTypes.func.isRequired,
  /**
   * Callback fired when the component is focused.
   * @param {React.FocusEvent<HTMLButtonElement>} event The event object.
   * @param {PickerValidDate} day The day.
   * @default () => {}
   */
  onFocus: PropTypes.func,
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible: PropTypes.func,
  /**
   * Callback fired when a key is pressed.
   * @param {React.KeyboardEvent<HTMLButtonElement>} event The event object.
   * @param {PickerValidDate} day The day.
   * @default () => {}
   */
  onKeyDown: PropTypes.func,
  /**
   * Callback fired when the mouse button is pressed.
   * @param {React.MouseEvent<HTMLButtonElement>} event The event object.
   * @default () => {}
   */
  onMouseDown: PropTypes.func,
  /**
   * Callback fired when the mouse enters the component.
   * @param {React.MouseEvent<HTMLButtonElement>} event The event object.
   * @param {PickerValidDate} day The day.
   * @default () => {}
   */
  onMouseEnter: PropTypes.func,
  /**
   * If `true`, the day is outside the current month.
   * @default false
   */
  outsideCurrentMonth: PropTypes.bool.isRequired,
  /**
   * If `true`, renders as selected.
   * @default false
   */
  selected: PropTypes.bool,
  /**
   * If `true`, days outside the current month are shown.
   * @default false
   */
  showDaysOutsideCurrentMonth: PropTypes.bool,
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * @default 0
   */
  tabIndex: PropTypes.number,
  /**
   * If `true`, today's day is highlighted.
   * @default false
   */
  today: PropTypes.bool,
  /**
   * Props applied to the `TouchRipple` element.
   */
  TouchRippleProps: PropTypes.object,
  /**
   * A ref that points to the `TouchRipple` element.
   */
  touchRippleRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        pulsate: PropTypes.func.isRequired,
        start: PropTypes.func.isRequired,
        stop: PropTypes.func.isRequired,
      }),
    }),
  ]),
} as any;

export const PickerDay = React.memo(PickerDayRaw) as PickerDayComponent;

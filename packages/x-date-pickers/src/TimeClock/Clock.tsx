'use client';
import * as React from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles';
import { styled, useThemeProps } from '@mui/material/styles';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import ownerDocument from '@mui/utils/ownerDocument';
import composeClasses from '@mui/utils/composeClasses';
import { ClockPointer } from './ClockPointer';
import { usePickerAdapter, usePickerTranslations } from '../hooks';
import type { PickerSelectionState } from '../internals/hooks/usePicker';
import type { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { CLOCK_HOUR_WIDTH, getHours, getMinutes } from './shared';
import type { PickerOwnerState, PickerValidDate, TimeView } from '../models';
import type { ClockClasses } from './clockClasses';
import { getClockUtilityClass } from './clockClasses';
import { formatMeridiem } from '../internals/utils/date-utils';
import type { Meridiem } from '../internals/utils/time-utils';
import type { FormProps } from '../internals/models/formProps';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

export interface ClockProps extends ReturnType<typeof useMeridiemMode>, FormProps {
  ampm: boolean;
  ampmInClock: boolean;
  autoFocus?: boolean;
  children: readonly React.ReactNode[];
  isTimeDisabled: (timeValue: number, type: TimeView) => boolean;
  minutesStep?: number;
  onChange: (value: number, isFinish?: PickerSelectionState) => void;
  /**
   * DOM id that the selected option should have
   * Should only be `undefined` on the server
   */
  selectedId: string | undefined;
  type: TimeView;
  /**
   * The numeric value of the current view.
   */
  viewValue: number;
  /**
   * The current full date value.
   */
  value: PickerValidDate | null;
  /**
   * Minimum and maximum value of the clock.
   */
  viewRange: [number, number];
  className?: string;
  classes?: Partial<ClockClasses>;
}

export interface ClockOwnerState extends PickerOwnerState {
  /**
   * `true` if the clock is disabled, `false` otherwise.
   */
  isClockDisabled: boolean;
  /**
   * The current meridiem mode of the clock.
   */
  clockMeridiemMode: Meridiem | null;
}

const useUtilityClasses = (
  classes: Partial<ClockClasses> | undefined,
  ownerState: ClockOwnerState,
) => {
  const slots = {
    root: ['root'],
    clock: ['clock'],
    wrapper: ['wrapper'],
    squareMask: ['squareMask'],
    pin: ['pin'],
    amButton: ['amButton', ownerState.clockMeridiemMode === 'am' && 'selected'],
    pmButton: ['pmButton', ownerState.clockMeridiemMode === 'pm' && 'selected'],
    meridiemText: ['meridiemText'],
  };

  return composeClasses(slots, getClockUtilityClass, classes);
};

const ClockRoot = styled('div', {
  name: 'MuiClock',
  slot: 'Root',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(2),
}));

const ClockClock = styled('div', {
  name: 'MuiClock',
  slot: 'Clock',
})({
  backgroundColor: 'rgba(0,0,0,.07)',
  borderRadius: '50%',
  height: 220,
  width: 220,
  flexShrink: 0,
  position: 'relative',
  pointerEvents: 'none',
});

const ClockWrapper = styled('div', {
  name: 'MuiClock',
  slot: 'Wrapper',
})({
  '&:focus': {
    outline: 'none',
  },
});

const ClockSquareMask = styled('div', {
  name: 'MuiClock',
  slot: 'SquareMask',
})<{ ownerState: ClockOwnerState }>({
  width: '100%',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'auto',
  outline: 0,
  // Disable scroll capabilities.
  touchAction: 'none',
  userSelect: 'none',
  variants: [
    {
      props: { isClockDisabled: false },
      style: {
        '@media (pointer: fine)': {
          cursor: 'pointer',
          borderRadius: '50%',
        },
        '&:active': {
          cursor: 'move',
        },
      },
    },
  ],
});

const ClockPin = styled('div', {
  name: 'MuiClock',
  slot: 'Pin',
})(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: (theme.vars || theme).palette.primary.main,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));

const meridiemButtonCommonStyles = (
  theme: Theme,
  clockMeridiemMode: ClockOwnerState['clockMeridiemMode'],
) => ({
  zIndex: 1,
  bottom: 8,
  paddingLeft: 4,
  paddingRight: 4,
  width: CLOCK_HOUR_WIDTH,
  variants: [
    {
      props: { clockMeridiemMode },
      style: {
        backgroundColor: (theme.vars || theme).palette.primary.main,
        color: (theme.vars || theme).palette.primary.contrastText,
        '&:hover': {
          backgroundColor: (theme.vars || theme).palette.primary.light,
        },
      },
    },
  ],
});

const ClockAmButton = styled(IconButton, {
  name: 'MuiClock',
  slot: 'AmButton',
})<{ ownerState: ClockOwnerState }>(({ theme }) => ({
  ...meridiemButtonCommonStyles(theme, 'am'),
  // keeping it here to make TS happy
  position: 'absolute',
  left: 8,
}));

const ClockPmButton = styled(IconButton, {
  name: 'MuiClock',
  slot: 'PmButton',
})<{ ownerState: ClockOwnerState }>(({ theme }) => ({
  ...meridiemButtonCommonStyles(theme, 'pm'),
  // keeping it here to make TS happy
  position: 'absolute',
  right: 8,
}));

const ClockMeridiemText = styled(Typography, {
  name: 'MuiClock',
  slot: 'MeridiemText',
})({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

/**
 * @ignore - internal component.
 */
export function Clock(inProps: ClockProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiClock' });
  const {
    ampm,
    ampmInClock,
    autoFocus,
    children,
    value,
    handleMeridiemChange,
    isTimeDisabled,
    meridiemMode,
    minutesStep = 1,
    onChange,
    selectedId,
    type,
    viewValue,
    viewRange: [minViewValue, maxViewValue],
    disabled = false,
    readOnly,
    className,
    classes: classesProp,
  } = props;

  const adapter = usePickerAdapter();
  const translations = usePickerTranslations();
  const { ownerState: pickerOwnerState } = usePickerPrivateContext();
  const ownerState: ClockOwnerState = {
    ...pickerOwnerState,
    isClockDisabled: disabled,
    clockMeridiemMode: meridiemMode,
  };
  const isMoving = React.useRef(false);
  const activePointerIdRef = React.useRef<number | null>(null);
  const squareMaskRef = React.useRef<HTMLDivElement>(null);
  const removeDragListenersRef = React.useRef<(() => void) | undefined>(undefined);
  const classes = useUtilityClasses(classesProp, ownerState);

  const isSelectedTimeDisabled = isTimeDisabled(viewValue, type);
  const isPointerInner = !ampm && type === 'hours' && (viewValue < 1 || viewValue > 12);

  const handleValueChange = (newValue: number, isFinish: PickerSelectionState) => {
    if (disabled || readOnly) {
      return;
    }
    if (isTimeDisabled(newValue, type)) {
      return;
    }

    onChange(newValue, isFinish);
  };

  const setTime = (event: PointerEvent | React.PointerEvent, isFinish: PickerSelectionState) => {
    const mask = squareMaskRef.current;
    // The document-level listeners can briefly outlive the mask during unmount:
    // React detaches refs before the cleanup effect removes the listeners, so a
    // pointer event firing in that window would otherwise dereference a null ref.
    if (!mask) {
      return;
    }

    // Resolve the pointer coordinates relative to the clock mask rather than from
    // `offsetX`/`offsetY`: the `pointermove`/`pointerup` listeners live on the
    // document (see `handlePointerDown`), so the event target can be any element
    // once the pointer leaves the clock.
    const rect = mask.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const newSelectedValue =
      type === 'seconds' || type === 'minutes'
        ? getMinutes(offsetX, offsetY, minutesStep)
        : getHours(offsetX, offsetY, Boolean(ampm));

    handleValueChange(newSelectedValue, isFinish);
  };

  // Pointer events are the single source of truth for mouse, touch and pen. The
  // move/up/cancel listeners are attached to the document so a drag keeps
  // tracking and commits even when the pointer is released outside the clock.
  const stopTracking = () => {
    isMoving.current = false;
    activePointerIdRef.current = null;
    // Idempotent: the cleanup clears its own ref, so calling `stopTracking` twice
    // (e.g. a `pointercancel` racing a `pointerup`) is a safe no-op.
    removeDragListenersRef.current?.();
  };

  const handleDocumentPointerMove = useEventCallback((event: PointerEvent) => {
    if (event.pointerId !== activePointerIdRef.current) {
      return;
    }
    event.preventDefault();
    setTime(event, 'shallow');
  });

  const handleDocumentPointerUp = useEventCallback((event: PointerEvent) => {
    if (event.pointerId !== activePointerIdRef.current) {
      return;
    }
    stopTracking();
    setTime(event, 'finish');
  });

  const handleDocumentPointerCancel = useEventCallback((event: PointerEvent) => {
    if (event.pointerId !== activePointerIdRef.current) {
      return;
    }
    // The gesture was interrupted by the user agent: drop it without committing.
    stopTracking();
  });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Ignore secondary buttons (middle = 1, right = 2), secondary multi-touch
    // pointers and interactions that can't change the value. `> 0` rather than
    // `!== 0` keeps the gesture permissive when `event.button` is left unset by a
    // synthetic event (some test environments), matching `useDragRange`.
    if (event.button > 0 || event.isPrimary === false || disabled || readOnly) {
      return;
    }

    // A fresh primary pointerdown ends any previous gesture whose pointerup was
    // lost, fully resetting its state before starting the new one.
    stopTracking();

    isMoving.current = true;
    activePointerIdRef.current = event.pointerId;

    const doc = ownerDocument(squareMaskRef.current);
    doc.addEventListener('pointermove', handleDocumentPointerMove);
    doc.addEventListener('pointerup', handleDocumentPointerUp);
    doc.addEventListener('pointercancel', handleDocumentPointerCancel);
    removeDragListenersRef.current = () => {
      doc.removeEventListener('pointermove', handleDocumentPointerMove);
      doc.removeEventListener('pointerup', handleDocumentPointerUp);
      doc.removeEventListener('pointercancel', handleDocumentPointerCancel);
      removeDragListenersRef.current = undefined;
    };

    setTime(event.nativeEvent, 'shallow');
  };

  const isPointerBetweenTwoClockValues = type === 'hours' ? false : viewValue % 5 !== 0;

  const keyboardControlStep = type === 'minutes' ? minutesStep : 1;

  const listboxRef = React.useRef<HTMLDivElement>(null);
  // Since this is rendered when a Popper is opened we can't use passive effects.
  // Focusing in passive effects in Popper causes scroll jump.
  useEnhancedEffect(() => {
    if (autoFocus) {
      // The ref not being resolved would be a bug in MUI.
      listboxRef.current!.focus();
    }
  }, [autoFocus]);

  // Clean up the document-level pointer listeners if the clock unmounts mid-drag.
  React.useEffect(() => () => removeDragListenersRef.current?.(), []);

  const clampValue = (newValue: number) => Math.max(minViewValue, Math.min(maxViewValue, newValue));

  const circleValue = (newValue: number) => (newValue + (maxViewValue + 1)) % (maxViewValue + 1);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // TODO: Why this early exit?
    if (isMoving.current) {
      return;
    }

    switch (event.key) {
      case 'Home':
        // reset both hours and minutes
        handleValueChange(minViewValue, 'partial');
        event.preventDefault();
        break;
      case 'End':
        handleValueChange(maxViewValue, 'partial');
        event.preventDefault();
        break;
      case 'ArrowUp':
        handleValueChange(circleValue(viewValue + keyboardControlStep), 'partial');
        event.preventDefault();
        break;
      case 'ArrowDown':
        handleValueChange(circleValue(viewValue - keyboardControlStep), 'partial');
        event.preventDefault();
        break;
      case 'PageUp':
        handleValueChange(clampValue(viewValue + 5), 'partial');
        event.preventDefault();
        break;
      case 'PageDown':
        handleValueChange(clampValue(viewValue - 5), 'partial');
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        handleValueChange(viewValue, 'finish');
        event.preventDefault();
        break;
      default:
      // do nothing
    }
  };

  return (
    <ClockRoot className={clsx(classes.root, className)}>
      <ClockClock className={classes.clock}>
        <ClockSquareMask
          data-testid="clock"
          ref={squareMaskRef}
          onPointerDown={handlePointerDown}
          ownerState={ownerState}
          className={classes.squareMask}
        />
        {!isSelectedTimeDisabled && (
          <React.Fragment>
            <ClockPin className={classes.pin} />
            {value != null && (
              <ClockPointer
                type={type}
                viewValue={viewValue}
                isInner={isPointerInner}
                isBetweenTwoClockValues={isPointerBetweenTwoClockValues}
              />
            )}
          </React.Fragment>
        )}
        <ClockWrapper
          aria-activedescendant={selectedId}
          aria-label={translations.clockLabelText(
            type,
            value == null ? null : adapter.format(value, ampm ? 'fullTime12h' : 'fullTime24h'),
          )}
          ref={listboxRef}
          role="listbox"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className={classes.wrapper}
        >
          {children}
        </ClockWrapper>
      </ClockClock>
      {ampm && ampmInClock && (
        <React.Fragment>
          <ClockAmButton
            data-testid="in-clock-am-btn"
            onClick={readOnly ? undefined : () => handleMeridiemChange('am')}
            disabled={disabled || meridiemMode === null}
            ownerState={ownerState}
            className={classes.amButton}
            title={formatMeridiem(adapter, 'am')}
          >
            <ClockMeridiemText variant="caption" className={classes.meridiemText}>
              {formatMeridiem(adapter, 'am')}
            </ClockMeridiemText>
          </ClockAmButton>
          <ClockPmButton
            disabled={disabled || meridiemMode === null}
            data-testid="in-clock-pm-btn"
            onClick={readOnly ? undefined : () => handleMeridiemChange('pm')}
            ownerState={ownerState}
            className={classes.pmButton}
            title={formatMeridiem(adapter, 'pm')}
          >
            <ClockMeridiemText variant="caption" className={classes.meridiemText}>
              {formatMeridiem(adapter, 'pm')}
            </ClockMeridiemText>
          </ClockPmButton>
        </React.Fragment>
      )}
    </ClockRoot>
  );
}

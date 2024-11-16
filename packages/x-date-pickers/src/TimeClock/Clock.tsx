import * as React from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps, Theme } from '@mui/material/styles';
import {
  unstable_useEnhancedEffect as useEnhancedEffect,
  unstable_composeClasses as composeClasses,
} from '@mui/utils';
import { ClockPointer } from './ClockPointer';
import { usePickerTranslations } from '../hooks/usePickerTranslations';
import { useUtils } from '../internals/hooks/useUtils';
import type { PickerSelectionState } from '../internals/hooks/usePicker';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import {CLOCK_WIDTH, CLOCK_HOUR_WIDTH, getDialValue, HOURS_STEPS, MINUTES_STEPS} from './shared';
import { PickerValidDate, TimeView } from '../models';
import { ClockClasses, getClockUtilityClass } from './clockClasses';
import { Meridiem } from '../internals/utils/time-utils';
import { FormProps } from '../internals/models/formProps';
import { MoonIcon, SunIcon } from '../icons';

export interface ClockProps extends ReturnType<typeof useMeridiemMode>, FormProps {
  ampm: boolean;
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
  className?: string;
  classes?: Partial<ClockClasses>;
}

const useUtilityClasses = (ownerState: ClockProps) => {
  const { classes, meridiemMode } = ownerState;
  const slots = {
    root: ['root'],
    clock: ['clock'],
    wrapper: ['wrapper'],
    squareMask: ['squareMask'],
    pin: ['pin'],
    amButton: ['amButton', meridiemMode === 'am' && 'selected'],
    pmButton: ['pmButton', meridiemMode === 'pm' && 'selected'],
    meridiemText: ['meridiemText'],
  };

  return composeClasses(slots, getClockUtilityClass, classes);
};

const ClockRoot = styled('div', {
  name: 'MuiClock',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(2),
}));

const ClockClock = styled('div', {
  name: 'MuiClock',
  slot: 'Clock',
  overridesResolver: (_, styles) => styles.clock,
})({
  backgroundColor: 'rgba(0,0,0,.07)',
  borderRadius: '50%',
  height: CLOCK_WIDTH,
  width: CLOCK_WIDTH,
  flexShrink: 0,
  position: 'relative',
  pointerEvents: 'none',
});

const ClockWrapper = styled('div', {
  name: 'MuiClock',
  slot: 'Wrapper',
  overridesResolver: (_, styles) => styles.wrapper,
})({
  '&:focus': {
    outline: 'none',
  },
});

type ClockSquareMaskOwnerState = {
  disabled?: ClockProps['disabled'];
};

const ClockSquareMask = styled('div', {
  name: 'MuiClock',
  slot: 'SquareMask',
  overridesResolver: (_, styles) => styles.squareMask,
})<{ ownerState: ClockSquareMaskOwnerState }>({
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
      props: { disabled: false },
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
  overridesResolver: (_, styles) => styles.pin,
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

const meridiemButtonCommonStyles = (theme: Theme, meridiemMode: Meridiem) => ({
  zIndex: 1,
  bottom: 8,
  paddingLeft: 4,
  paddingRight: 4,
  width: CLOCK_HOUR_WIDTH,
  variants: [
    {
      props: { meridiemMode },
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
  overridesResolver: (_, styles) => styles.amButton,
})<{ ownerState: ClockProps }>(({ theme }) => ({
  ...meridiemButtonCommonStyles(theme, 'am'),
  // keeping it here to make TS happy
  position: 'absolute',
  left: 8,
}));

const ClockPmButton = styled(IconButton, {
  name: 'MuiClock',
  slot: 'PmButton',
  overridesResolver: (_, styles) => styles.pmButton,
})<{ ownerState: ClockProps }>(({ theme }) => ({
  ...meridiemButtonCommonStyles(theme, 'pm'),
  // keeping it here to make TS happy
  position: 'absolute',
  right: 8,
}));

const ClockMeridiemText = styled(Typography, {
  name: 'MuiClock',
  slot: 'meridiemText',
  overridesResolver: (_, styles) => styles.meridiemText,
})({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});





function getHourComplications(ampm:boolean) {

  const innerSize = Math.round(CLOCK_WIDTH * 0.70)

  return (
      <>
        {ampm && (<>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-97.5deg)',
            height: innerSize,
            width: innerSize,
          }}>
            <div style={{
              width: '100%',
              height: '50%',
              borderTopLeftRadius: innerSize/2,
              borderTopRightRadius: innerSize/2,
              backgroundColor: '#C2C2C266'
            }}/>
          </div>
          <div
              style={{
                position: 'absolute',
                top: '52%',
                left: '30%',
                transform: 'translate(-50%, -50%)',
                fontWeight: 700.
              }}
          >PM</div>
          <div
            style={{
            position: 'absolute',
            top: '48%',
            left: '70%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 700.
          }}>AM</div>
        </>)}
        <div
            style={{
              position: 'absolute',
              top: '25%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
        }}>
          <MoonIcon
            fontSize='large'
            sx={{
              color:"#0288d1"
            }}
          />
        </div>
        <div
            style={{
              position: 'absolute',
              top: '75%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
          <SunIcon
              fontSize="large"
              sx={{
                color:"#f57c00"
              }}
          />
        </div>
      </>
  )
}

function getMinuteComplications() {
  return (
    <div style={{
      border: "3px dotted lightgray",
      borderRadius: '50%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '72%',
      height: '72%',
    }}/>
  )
}


/**
 * @ignore - internal component.
 */
export function Clock(inProps: ClockProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiClock' });
  const {
    ampm,
    autoFocus,
    children,
    value,
    isTimeDisabled,
    minutesStep = 1,
    onChange,
    selectedId,
    type,
    viewValue,
    disabled = false,
    readOnly,
    className,
  } = props;

  const ownerState = props;

  const utils = useUtils();
  const translations = usePickerTranslations();
  const isMoving = React.useRef(false);
  const classes = useUtilityClasses(ownerState);

  const isSelectedTimeDisabled = isTimeDisabled(viewValue, type);

  const handleValueChange = (newValue: number, isFinish: PickerSelectionState) => {
    if (disabled || readOnly) {
      return;
    }
    if (isTimeDisabled(newValue, type)) {
      return;
    }

    onChange(newValue, isFinish);
  };

  const setTime = (event: MouseEvent | React.TouchEvent, isFinish: PickerSelectionState) => {
    let { offsetX, offsetY } = event as MouseEvent;

    if (offsetX === undefined) {
      const rect = ((event as React.TouchEvent).target as HTMLElement).getBoundingClientRect();

      offsetX = (event as React.TouchEvent).changedTouches[0].clientX - rect.left;
      offsetY = (event as React.TouchEvent).changedTouches[0].clientY - rect.top;
    }

    const newSelectedValue = getDialValue(
        offsetX,
        offsetY,
        type === 'hours' ? HOURS_STEPS : MINUTES_STEPS
    );

    handleValueChange(newSelectedValue, isFinish);
  };

  const handleTouchSelection = (event: React.TouchEvent) => {
    isMoving.current = true;
    setTime(event, 'shallow');
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (isMoving.current) {
      setTime(event, 'finish');
      isMoving.current = false;
    }
    event.preventDefault();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    // event.buttons & PRIMARY_MOUSE_BUTTON
    if (event.buttons > 0) {
      setTime(event.nativeEvent, 'shallow');
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (isMoving.current) {
      isMoving.current = false;
    }

    setTime(event.nativeEvent, 'finish');
  };

  const hasSelected = React.useMemo(() => {
    if (type === 'hours') {
      return true;
    }
    // showing minutes and only every 5th minute is shown on the dial.
    return viewValue % 5 === 0;
  }, [type, viewValue]);

  const hourComplications = React.useMemo(()=> {
    return getHourComplications(ampm)
  }, [ampm])

  const minuteComplications = React.useMemo(()=>{
    return getMinuteComplications()
  }, [])

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // TODO: Why this early exit?
    if (isMoving.current) {
      return;
    }

    switch (event.key) {
      case 'Home':
        // reset both hours and minutes
        handleValueChange(0, 'partial');
        event.preventDefault();
        break;
      case 'End':
        handleValueChange(type === 'minutes' ? 59 : 23, 'partial');
        event.preventDefault();
        break;
      case 'ArrowUp':
        handleValueChange(viewValue + keyboardControlStep, 'partial');
        event.preventDefault();
        break;
      case 'ArrowDown':
        handleValueChange(viewValue - keyboardControlStep, 'partial');
        event.preventDefault();
        break;
      case 'PageUp':
        handleValueChange(viewValue + 5, 'partial');
        event.preventDefault();
        break;
      case 'PageDown':
        handleValueChange(viewValue - 5, 'partial');
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
          onTouchMove={handleTouchSelection}
          onTouchStart={handleTouchSelection}
          onTouchEnd={handleTouchEnd}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          ownerState={{ disabled }}
          className={classes.squareMask}
        />
        {type === 'hours' && hourComplications}
        {type === 'minutes' && minuteComplications}
        {!isSelectedTimeDisabled && (
          <React.Fragment>
            <ClockPin className={classes.pin} />
            {value != null && (
              <ClockPointer
                type={type}
                viewValue={viewValue}
                hasSelected={hasSelected}
              />
            )}
          </React.Fragment>
        )}
        <ClockWrapper
          aria-activedescendant={selectedId}
          aria-label={translations.clockLabelText(
            type,
            value == null ? null : utils.format(value, 'fullTime'),
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
    </ClockRoot>
  );
}

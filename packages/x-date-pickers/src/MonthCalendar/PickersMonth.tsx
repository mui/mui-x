import * as React from 'react';
import { styled, alpha, useThemeProps } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/utils';
import {
  WrapperVariant,
  WrapperVariantContext,
} from '../internals/components/wrappers/WrapperVariantContext';
import {
  getPickersMonthUtilityClass,
  pickersMonthClasses,
  PickersMonthClasses,
} from './pickersMonthClasses';

export interface ExportedPickersMonthProps {
  classes?: Partial<PickersMonthClasses>;
}

interface PickersMonthProps extends ExportedPickersMonthProps {
  'aria-current'?: React.AriaAttributes['aria-current'];
  autoFocus: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: (event: React.MouseEvent, month: number) => void;
  onKeyDown: (event: React.KeyboardEvent, month: number) => void;
  onFocus: (event: React.FocusEvent, month: number) => void;
  onBlur: (event: React.FocusEvent, month: number) => void;
  selected?: boolean;
  value: number;
  tabIndex: number;
}

interface PickersMonthOwnerState extends PickersMonthProps {
  wrapperVariant: WrapperVariant;
}

const useUtilityClasses = (ownerState: PickersMonthOwnerState) => {
  const { wrapperVariant, disabled, selected, classes } = ownerState;

  const slots = {
    root: ['root', wrapperVariant && `mode${capitalize(wrapperVariant)}`],
    monthButton: ['monthButton', disabled && 'disabled', selected && 'selected'],
  };

  return composeClasses(slots, getPickersMonthUtilityClass, classes);
};

const PickersMonthRoot = styled('div', {
  name: 'MuiPickersMonth',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    styles.root,
    { [`&.${pickersMonthClasses.modeDesktop}`]: styles.modeDesktop },
    { [`&.${pickersMonthClasses.modeMobile}`]: styles.modeMobile },
  ],
})<{
  ownerState: PickersMonthOwnerState;
}>({
  flexBasis: '33.3%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const PickersMonthButton = styled('button', {
  name: 'MuiPickersMonth',
  slot: 'MonthButton',
  overridesResolver: (_, styles) => [
    styles.monthButton,
    { [`&.${pickersMonthClasses.disabled}`]: styles.disabled },
    { [`&.${pickersMonthClasses.selected}`]: styles.selected },
  ],
})<{
  ownerState: PickersMonthOwnerState;
}>(({ theme }) => ({
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  ...theme.typography.subtitle1,
  margin: '8px 0',
  height: 36,
  width: 72,
  borderRadius: 18,
  cursor: 'pointer',
  '&:focus': {
    backgroundColor: alpha(theme.palette.action.active, theme.palette.action.focusOpacity),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  '&:disabled': {
    cursor: 'auto',
    pointerEvents: 'none',
  },
  [`&.${pickersMonthClasses.disabled}`]: {
    color: theme.palette.text.secondary,
  },
  [`&.${pickersMonthClasses.selected}`]: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

/**
 * @ignore - do not document.
 */
const PickersMonth = React.memo(function PickersMonth(inProps: PickersMonthProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersMonth',
  });
  const {
    autoFocus,
    children,
    disabled,
    selected,
    value,
    tabIndex,
    onClick,
    onKeyDown,
    onFocus,
    onBlur,
    'aria-current': ariaCurrent,
    ...other
  } = props;

  const wrapperVariant = React.useContext(WrapperVariantContext);

  const ref = React.useRef<HTMLButtonElement>(null);
  useEnhancedEffect(() => {
    if (autoFocus) {
      ref.current?.focus();
    }
  }, [autoFocus]);

  const ownerState = { ...props, wrapperVariant };

  const classes = useUtilityClasses(ownerState);

  return (
    <PickersMonthRoot
      data-mui-test="month"
      className={classes.root}
      ownerState={ownerState}
      {...other}
    >
      <PickersMonthButton
        ref={ref}
        disabled={disabled}
        type="button"
        tabIndex={disabled ? -1 : tabIndex}
        aria-current={ariaCurrent}
        onClick={(event) => onClick(event, value)}
        onKeyDown={(event) => onKeyDown(event, value)}
        onFocus={(event) => onFocus(event, value)}
        onBlur={(event) => onBlur(event, value)}
        className={classes.monthButton}
        ownerState={ownerState}
      >
        {children}
      </PickersMonthButton>
    </PickersMonthRoot>
  );
});

export { PickersMonth };

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
  generateUtilityClass,
  generateUtilityClasses,
  unstable_composeClasses as composeClasses,
} from '@mui/material';
import { capitalize, unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import {
  WrapperVariant,
  WrapperVariantContext,
} from '../internals/components/wrappers/WrapperVariantContext';

interface PickersMonthClasses {
  root: string;
  modeDesktop: string;
  modeMobile: string;
  monthButton: string;
  disabled: string;
  selected: string;
}

function getPickersYearUtilityClass(slot: string) {
  return generateUtilityClass('PrivatePickersMonth', slot);
}

const pickersMonthClasses = generateUtilityClasses('PrivatePickersMonth', [
  'root',
  'modeMobile',
  'modeDesktop',
  'monthButton',
  'disabled',
  'selected',
]);

interface PickersMonthProps {
  autoFocus: boolean;
  children: React.ReactNode;
  classes?: Partial<PickersMonthClasses>;
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
    yearButton: ['yearButton', disabled && 'disabled', selected && 'selected'],
  };

  return composeClasses(slots, getPickersYearUtilityClass, classes);
};

const PickersYearRoot = styled('div')<{
  ownerState: PickersMonthOwnerState;
}>(({ ownerState }) => ({
  flexBasis: '33.3%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...(ownerState?.wrapperVariant === 'desktop' && {
    flexBasis: '25%',
  }),
}));

const PickersYearButton = styled('button')<{
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
  '&:focus, &:hover': {
    backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
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
const PickersMonthRaw = (props: PickersMonthProps) => {
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
    <PickersYearRoot data-mui-test="month" className={classes.root} ownerState={ownerState}>
      <PickersYearButton
        ref={ref}
        disabled={disabled}
        type="button"
        data-mui-test={`month-${value}`}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={(event) => onClick(event, value)}
        onKeyDown={(event) => onKeyDown(event, value)}
        onFocus={(event) => onFocus(event, value)}
        onBlur={(event) => onBlur(event, value)}
        className={classes.yearButton}
        ownerState={ownerState}
        {...other}
      >
        {children}
      </PickersYearButton>
    </PickersYearRoot>
  );
};

/**
 * @ignore - do not document.
 */
export const PickersMonth = React.memo(PickersMonthRaw);

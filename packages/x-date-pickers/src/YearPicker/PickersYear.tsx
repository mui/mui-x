import * as React from 'react';
import clsx from 'clsx';
import { capitalize } from '@mui/material/utils';
import { alpha, styled } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
} from '@mui/material';
import {
  WrapperVariant,
  WrapperVariantContext,
} from '../internals/components/wrappers/WrapperVariantContext';

interface PickersYearClasses {
  root: string;
  modeDesktop: string;
  modeMobile: string;
  yearButton: string;
  disabled: string;
  selected: string;
}

function getPickersYearUtilityClass(slot: string) {
  return generateUtilityClass('PrivatePickersYear', slot);
}

const pickersYearClasses: PickersYearClasses = generateUtilityClasses('PrivatePickersYear', [
  'root',
  'modeMobile',
  'modeDesktop',
  'yearButton',
  'disabled',
  'selected',
]);

interface PickersYearProps {
  autoFocus?: boolean;
  children: React.ReactNode;
  classes?: Partial<PickersYearClasses>;
  className?: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent, year: number) => void;
  onKeyDown: (event: React.KeyboardEvent, year: number) => void;
  onFocus: (event: React.FocusEvent, year: number) => void;
  onBlur: (event: React.FocusEvent, year: number) => void;
  selected: boolean;
  value: number;
  tabIndex: number;
}

interface PickersYearOwnerState extends PickersYearProps {
  wrapperVariant: WrapperVariant;
}

const useUtilityClasses = (ownerState: PickersYearOwnerState) => {
  const { wrapperVariant, disabled, selected, classes } = ownerState;

  const slots = {
    root: ['root', wrapperVariant && `mode${capitalize(wrapperVariant)}`],
    yearButton: ['yearButton', disabled && 'disabled', selected && 'selected'],
  };

  return composeClasses(slots, getPickersYearUtilityClass, classes);
};

const PickersYearRoot = styled('div')<{
  ownerState: PickersYearOwnerState;
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
  ownerState: PickersYearOwnerState;
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
  [`&.${pickersYearClasses.disabled}`]: {
    color: theme.palette.text.secondary,
  },
  [`&.${pickersYearClasses.selected}`]: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

/**
 * @ignore - internal component.
 */
const PickersYearRaw = (props: PickersYearProps) => {
  const {
    autoFocus,
    className,
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
  const ref = React.useRef<HTMLButtonElement>(null);
  const wrapperVariant = React.useContext(WrapperVariantContext);

  const ownerState = {
    ...props,
    wrapperVariant,
  };

  const classes = useUtilityClasses(ownerState);

  // TODO: Can we just forward this to the button?
  React.useEffect(() => {
    if (autoFocus) {
      // `ref.current` being `null` would be a bug in MUI.
      ref.current!.focus();
    }
  }, [autoFocus]);

  return (
    <PickersYearRoot
      data-mui-test="year"
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <PickersYearButton
        ref={ref}
        disabled={disabled}
        type="button"
        data-mui-test={`year-${children}`}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={(event) => onClick(event, value)}
        onKeyDown={(event) => onKeyDown(event, value)}
        onFocus={(event) => onFocus(event, value)}
        onBlur={(event) => onBlur(event, value)}
        className={classes.yearButton}
        ownerState={ownerState}
      >
        {children}
      </PickersYearButton>
    </PickersYearRoot>
  );
};

/**
 * @ignore - do not document.
 */
export const PickersYear = React.memo(PickersYearRaw);

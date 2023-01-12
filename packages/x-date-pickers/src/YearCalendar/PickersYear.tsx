import * as React from 'react';
import clsx from 'clsx';
import {
  unstable_capitalize as capitalize,
  unstable_composeClasses as composeClasses,
} from '@mui/utils';
import { alpha, styled, useThemeProps } from '@mui/material/styles';
import { WrapperVariantContext } from '../internals/components/wrappers/WrapperVariantContext';
import {
  getPickersYearUtilityClass,
  pickersYearClasses,
  PickersYearClasses,
} from './pickersYearClasses';
import { WrapperVariant } from '../internals/models/common';

export interface ExportedPickersYearProps {
  classes?: Partial<PickersYearClasses>;
}

export interface PickersYearProps extends ExportedPickersYearProps {
  'aria-current'?: React.AriaAttributes['aria-current'];
  autoFocus?: boolean;
  children: React.ReactNode;
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

const PickersYearRoot = styled('div', {
  name: 'MuiPickersYear',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    styles.root,
    { [`&.${pickersYearClasses.modeDesktop}`]: styles.modeDesktop },
    { [`&.${pickersYearClasses.modeMobile}`]: styles.modeMobile },
  ],
})<{ ownerState: PickersYearOwnerState }>(({ ownerState }) => ({
  flexBasis: '33.3%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...(ownerState?.wrapperVariant === 'desktop' && {
    flexBasis: '25%',
  }),
}));

const PickersYearButton = styled('button', {
  name: 'MuiPickersYear',
  slot: 'YearButton',
  overridesResolver: (_, styles) => [
    styles.yearButton,
    { [`&.${pickersYearClasses.disabled}`]: styles.disabled },
    { [`&.${pickersYearClasses.selected}`]: styles.selected },
  ],
})<{ ownerState: PickersYearOwnerState }>(({ theme }) => ({
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
  [`&.${pickersYearClasses.disabled}`]: {
    color: (theme.vars || theme).palette.text.secondary,
  },
  [`&.${pickersYearClasses.selected}`]: {
    color: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
}));

/**
 * @ignore - internal component.
 */
const PickersYear = React.memo(function PickersYear(inProps: PickersYearProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersYear',
  });
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
    'aria-current': ariaCurrent,
    ...other
  } = props;
  const ref = React.useRef<HTMLButtonElement>(null);
  const wrapperVariant = React.useContext(WrapperVariantContext);

  const ownerState = {
    ...props,
    wrapperVariant,
  };

  const classes = useUtilityClasses(ownerState);

  // We can't forward the `autoFocus` to the button because it is a native button, not a MUI Button
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
        tabIndex={disabled ? -1 : tabIndex}
        aria-current={ariaCurrent}
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
});

export { PickersYear };

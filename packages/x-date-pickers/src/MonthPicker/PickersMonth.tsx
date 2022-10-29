import * as React from 'react';
import Typography, { TypographyTypeMap } from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import { onSpaceOrEnter } from '../internals/utils/utils';
import {
  getPickersMonthUtilityClass,
  pickersMonthClasses,
  PickersMonthClasses,
} from './pickersMonthClasses';

export interface MonthProps {
  children: React.ReactNode;
  disabled?: boolean;
  onSelect: (value: number) => void;
  selected?: boolean;
  value: number;
  hasFocus: boolean;
  onBlur: (event: React.FocusEvent, month: number) => void;
  onFocus: (event: React.FocusEvent, month: number) => void;
  tabIndex: number;
  classes?: Partial<PickersMonthClasses>;
}

const useUtilityClasses = (ownerState: MonthProps) => {
  const { classes, selected } = ownerState;
  const slots = {
    root: ['root', selected && 'selected'],
  };

  return composeClasses(slots, getPickersMonthUtilityClass, classes);
};

const PickersMonthRoot = styled<
  OverridableComponent<TypographyTypeMap<{ component?: React.ElementType; disabled?: boolean }>>
>(Typography, {
  name: 'PrivatePickersMonth',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    styles.root,
    { [`&.${pickersMonthClasses.selected}`]: styles.selected },
  ],
})(({ theme }) => ({
  flex: '1 0 33.33%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  ...theme.typography.subtitle1,
  margin: '8px 0',
  height: 36,
  borderRadius: 18,
  cursor: 'pointer',
  '&:focus, &:hover': {
    backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  '&:disabled': {
    pointerEvents: 'none',
    color: theme.palette.text.secondary,
  },
  [`&.${pickersMonthClasses.selected}`]: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
})) as typeof Typography;

const noop = () => {};
/**
 * @ignore - do not document.
 */
export function PickersMonth(props: MonthProps) {
  // TODO v6 add 'useThemeProps' once the component class names are aligned
  const {
    disabled,
    onSelect,
    selected,
    value,
    tabIndex,
    hasFocus,
    onFocus = noop,
    onBlur = noop,
    ...other
  } = props;
  const classes = useUtilityClasses(props);

  const handleSelection = () => {
    onSelect(value);
  };

  const ref = React.useRef<HTMLButtonElement>(null);
  useEnhancedEffect(() => {
    if (hasFocus) {
      ref.current?.focus();
    }
  }, [hasFocus]);

  return (
    <PickersMonthRoot
      ref={ref}
      data-mui-test="month"
      component="button"
      type="button"
      className={classes.root}
      tabIndex={tabIndex}
      onClick={handleSelection}
      onKeyDown={onSpaceOrEnter(handleSelection)}
      color={selected ? 'primary' : undefined}
      variant={selected ? 'h5' : 'subtitle1'}
      disabled={disabled}
      onFocus={(event: React.FocusEvent) => onFocus(event, value)}
      onBlur={(event: React.FocusEvent) => onBlur(event, value)}
      {...other}
    />
  );
}

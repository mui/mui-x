import * as React from 'react';
import clsx from 'clsx';
import Typography, { TypographyTypeMap } from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { generateUtilityClasses } from '@mui/material';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import { onSpaceOrEnter } from '../internals/utils/utils';

const classes = generateUtilityClasses('PrivatePickersMonth', ['root', 'selected']);

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
}

export type PickersMonthClassKey = keyof typeof classes;

const PickersMonthRoot = styled<
  OverridableComponent<TypographyTypeMap<{ component?: React.ElementType; disabled?: boolean }>>
>(Typography)(({ theme }) => ({
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
  [`&.${classes.selected}`]: {
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
export const PickersMonth: React.FC<MonthProps> = (props) => {
  const {
    disabled,
    onSelect,
    selected,
    value,
    tabIndex,
    hasFocus,
    onFocus = noop,
    onBlur = noop,
  } = props;

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
      className={clsx(classes.root, {
        [classes.selected]: selected,
      })}
      tabIndex={tabIndex}
      onClick={handleSelection}
      onKeyDown={onSpaceOrEnter(handleSelection)}
      color={selected ? 'primary' : undefined}
      variant={selected ? 'h5' : 'subtitle1'}
      disabled={disabled}
      onFocus={(event) => onFocus(event, value)}
      onBlur={(event) => onBlur(event, value)}
    />
  );
};
